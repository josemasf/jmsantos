---
title: "Arquitectura de widgets autocontenidos en Blazor: principios y flujo de trabajo"
description: "Cómo diseñar componentes Blazor reutilizables que encapsulan lógica de negocio, llamadas API y gestión de estados, usando inyección de dependencias y separación de responsabilidades."
date: 2026-03-20
tags: [Blazor, arquitectura, componentes, .NET, widgets, DI]
category: Arquitectura
image:
  src: /images/blog/16-widgets-autocontenidos-blazor/widgets-autocontenidos-blazor.png
  alt: Ilustración de módulos encapsulados con estado, API y dependencias organizadas.
  width: 1536
  height: 1024
---

Cuando múltiples equipos comparten componentes entre módulos, la tentación de crear componentes "tontos" que reciben datos del padre es fuerte. Pero en una plataforma empresarial, los **widgets autocontenidos** — componentes que gestionan sus propios datos — son una alternativa más escalable.

## ¿Qué es un widget autocontenido?

Un widget autocontenido es un componente que encapsula:

- **UI**: la representación visual
- **Lógica de negocio**: transformaciones y reglas
- **Acceso a datos**: llamadas HTTP a la API
- **Gestión de estados**: cargando, éxito, error, vacío

El padre solo proporciona **parámetros de configuración** (un ID, un rango de fechas, un filtro), no los datos en sí.

## Principios fundamentales

### 1. Autonomía y aislamiento

El widget debe funcionar de forma independiente. Su lógica para obtener y mostrar datos no depende del padre más allá de los parámetros que recibe.

### 2. Separación de responsabilidades

```
📁 SalesSummaryWidget/
├── SalesSummaryWidget.razor     → UI (presentación)
├── SalesSummaryService.cs       → Datos (API calls)
└── SalesSummaryModel.cs         → Modelo de datos
```

- **Capa de Vista** (`.razor`): renderización, eventos de usuario, estados visuales
- **Capa de Servicio** (`.cs`): comunicación HTTP, mapeo de datos, lógica de negocio

### 3. Inyección de dependencias

Usamos el sistema de DI de .NET Core para proporcionar servicios a los componentes:

```csharp
// Registro del servicio
builder.Services.AddScoped<ISalesSummaryService, SalesSummaryService>();
```

```csharp
// Inyección en el componente
@inject ISalesSummaryService SalesService
```

### 4. Gestión de estado explícita

Cada widget vive a través de un ciclo:

```
[Cargando] → [Éxito] → (interacción) → [Cargando] → ...
                ↓
            [Vacío] (sin datos)
                ↓
            [Error] (fallo API)
```

## Ejemplo práctico: SalesSummaryWidget

### Paso 1: Definir el modelo

```csharp
public record SalesSummary(
    decimal TotalRevenue,
    int TotalOrders,
    decimal AverageOrderValue,
    DateTime PeriodStart,
    DateTime PeriodEnd
);
```

### Paso 2: Crear el servicio

```csharp
public interface ISalesSummaryService
{
    Task<SalesSummary?> GetSummaryAsync(
        DateTime startDate,
        DateTime endDate
    );
}

public class SalesSummaryService : ISalesSummaryService
{
    private readonly HttpClient _http;

    public SalesSummaryService(HttpClient http)
    {
        _http = http;
    }

    public async Task<SalesSummary?> GetSummaryAsync(
        DateTime startDate,
        DateTime endDate)
    {
        var response = await _http.GetAsync(
            $"/api/sales/summary" +
            $"?startDate={startDate:yyyy-MM-dd}" +
            $"&endDate={endDate:yyyy-MM-dd}"
        );

        if (!response.IsSuccessStatusCode)
            return null;

        return await response.Content
            .ReadFromJsonAsync<SalesSummary>();
    }
}
```

### Paso 3: Crear el componente

```razor
@inject ISalesSummaryService SalesService

<div class="sales-widget">
    @if (_loading)
    {
        <LoadingSpinner />
    }
    else if (_error)
    {
        <ErrorMessage Message="No se pudieron cargar los datos"
                      OnRetry="LoadData" />
    }
    else if (_data is null)
    {
        <EmptyState Message="Sin datos para el período" />
    }
    else
    {
        <div class="sales-summary">
            <MetricCard Title="Ingresos"
                       Value="@_data.TotalRevenue.ToString("C")" />
            <MetricCard Title="Pedidos"
                       Value="@_data.TotalOrders.ToString()" />
            <MetricCard Title="Ticket medio"
                       Value="@_data.AverageOrderValue.ToString("C")" />
        </div>
    }
</div>

@code {
    [Parameter] public DateTime StartDate { get; set; }
    [Parameter] public DateTime EndDate { get; set; }

    private SalesSummary? _data;
    private bool _loading = true;
    private bool _error;

    protected override async Task OnParametersSetAsync()
    {
        await LoadData();
    }

    private async Task LoadData()
    {
        _loading = true;
        _error = false;
        StateHasChanged();

        try
        {
            _data = await SalesService.GetSummaryAsync(
                StartDate, EndDate);
        }
        catch
        {
            _error = true;
        }
        finally
        {
            _loading = false;
            StateHasChanged();
        }
    }
}
```

### Uso del widget

```razor
<SalesSummaryWidget
    StartDate="@DateTime.Today.AddMonths(-1)"
    EndDate="@DateTime.Today" />
```

El padre no necesita saber nada sobre la API de ventas, el formato de los datos, ni la gestión de errores.

## Ventajas de este patrón

1. **Reutilización real**: el mismo widget funciona en cualquier página con diferentes parámetros
2. **Testing aislado**: puedes mockear el servicio sin montar la página completa
3. **Desarrollo paralelo**: un equipo trabaja en el widget mientras otro trabaja en la página
4. **Mantenimiento localizado**: los cambios en la API solo afectan al servicio del widget

## Conclusión

Los widgets autocontenidos en Blazor siguen los mismos principios que los componentes bien diseñados en cualquier framework: responsabilidad única, inyección de dependencias y gestión explícita de estados. La diferencia es que en Blazor, el sistema de DI de .NET hace que este patrón sea especialmente natural y testable.
