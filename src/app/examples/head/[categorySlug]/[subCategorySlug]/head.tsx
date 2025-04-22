import { fetchSubCategory, type PageProps } from '#/lib/data/getCategories';
import { DefaultTags } from '#/layout/ui/playground/DefaultTags';

export default async function Head({ params }: PageProps) {
  const category = await fetchSubCategory(
    params.categorySlug,
    params.subCategorySlug,
  );

  const title = `${category?.name} | Next.js App Directory`;
  const description = `The best fictional ${category?.name} money can buy.`;

  return (
    <>
      <DefaultTags />
      <title>{title}</title>
      <meta name="description" content={description} />
    </>
  );
}
