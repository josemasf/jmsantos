declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof typeof entryMap> =
		(typeof entryMap)[C][keyof (typeof entryMap)[C]] & Render;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	type BaseCollectionConfig<S extends BaseSchema> = {
		schema?: S;
		slug?: (entry: {
			id: CollectionEntry<keyof typeof entryMap>['id'];
			defaultSlug: string;
			collection: string;
			body: string;
			data: import('astro/zod').infer<S>;
		}) => string | Promise<string>;
	};
	export function defineCollection<S extends BaseSchema>(
		input: BaseCollectionConfig<S>
	): BaseCollectionConfig<S>;

	type EntryMapKeys = keyof typeof entryMap;
	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidEntrySlug<C extends EntryMapKeys> = AllValuesOf<(typeof entryMap)[C]>['slug'];

	export function getEntryBySlug<
		C extends keyof typeof entryMap,
		E extends ValidEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getCollection<C extends keyof typeof entryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof typeof entryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	type InferEntrySchema<C extends keyof typeof entryMap> = import('astro/zod').infer<
		Required<ContentConfig['collections'][C]>['schema']
	>;

	type Render = {
		render(): Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	};

	const entryMap: {
		"jobs": {
"innovation.md": {
  id: "innovation.md",
  slug: "innovation",
  body: string,
  collection: "jobs",
  data: any
},
"ofg.md": {
  id: "ofg.md",
  slug: "ofg",
  body: string,
  collection: "jobs",
  data: any
},
"vistalegre.md": {
  id: "vistalegre.md",
  slug: "vistalegre",
  body: string,
  collection: "jobs",
  data: any
},
},
"posts": {
"asd.md": {
  id: "asd.md",
  slug: "asd",
  body: string,
  collection: "posts",
  data: any
},
"primer-post.md": {
  id: "primer-post.md",
  slug: "primer-post",
  body: string,
  collection: "posts",
  data: any
},
},
"presentations": {
"microfront.md": {
  id: "microfront.md",
  slug: "microfront",
  body: string,
  collection: "presentations",
  data: any
},
"mocking-and-testing.md": {
  id: "mocking-and-testing.md",
  slug: "mocking-and-testing",
  body: string,
  collection: "presentations",
  data: any
},
"serverless.md": {
  id: "serverless.md",
  slug: "serverless",
  body: string,
  collection: "presentations",
  data: any
},
},

	};

	type ContentConfig = never;
}
