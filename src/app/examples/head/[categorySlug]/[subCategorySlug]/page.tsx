import { HeadInfo } from '~/src/app/examples/head/HeadInfo';
import { fetchSubCategory, PageProps } from '~/src/lib/api/data/getCategories';

export default async function Page({ params }: PageProps) {
  const category = await fetchSubCategory(
    params.categorySlug,
    params.subCategorySlug,
  );
  if (!category) return null;

  return (
    <div className="space-y-6">
      <div className="text-xl font-medium text-gray-500">{category.name}</div>

      <HeadInfo />
    </div>
  );
}
