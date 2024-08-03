import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Product = db.define('products', {
  _id: { type: DataTypes.STRING, primaryKey: true },
  complete: { type: DataTypes.INTEGER, allowNull: true },
  countries_hierarchy: { type: DataTypes.JSON, allowNull: true },
  nutriscore: { type: DataTypes.JSON, allowNull: true },
  product_quantity: { type: DataTypes.STRING, allowNull: true },
  ingredients_that_may_be_from_palm_oil_n: { type: DataTypes.INTEGER, allowNull: true },
  images: { type: DataTypes.JSON, allowNull: true },
  nova_group_error: { type: DataTypes.STRING, allowNull: true },
  ingredients_percent_analysis: { type: DataTypes.STRING, allowNull: true },
  manufacturing_places_debug_tags: { type: DataTypes.JSON, allowNull: true },
  nutrition_grades: { type: DataTypes.STRING, allowNull: true },
  nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients_value: { type: DataTypes.STRING, allowNull: true },
  product_name: { type: DataTypes.STRING, allowNull: true },
  generic_name: { type: DataTypes.STRING, allowNull: true },
  manufacturing_places: { type: DataTypes.STRING, allowNull: true },
  countries: { type: DataTypes.STRING, allowNull: true },
  categories_old: { type: DataTypes.STRING, allowNull: true },
  countries_tags: { type: DataTypes.JSON, allowNull: true },
  nutriments: { type: DataTypes.JSON, allowNull: true },
  ingredients_with_specified_percent_sum: { type: DataTypes.STRING, allowNull: true },
  vitamins_prev_tags: { type: DataTypes.JSON, allowNull: true },
  ingredients_from_or_that_may_be_from_palm_oil_n: { type: DataTypes.INTEGER, allowNull: true },
  nutrient_levels_tags: { type: DataTypes.JSON, allowNull: true },
  nutriscore_tags: { type: DataTypes.JSON, allowNull: true },
  ingredients_with_unspecified_percent_sum: { type: DataTypes.STRING, allowNull: true },
  lang: { type: DataTypes.STRING, allowNull: true },
  link: { type: DataTypes.STRING, allowNull: true },
  ingredients_text_en_debug_tags: { type: DataTypes.JSON, allowNull: true },
  entry_dates_tags: { type: DataTypes.JSON, allowNull: true },
  ingredients_text_with_allergens_fr: { type: DataTypes.STRING, allowNull: true },
  last_modified_t: { type: DataTypes.STRING, allowNull: true },
  packagings: { type: DataTypes.JSON, allowNull: true },
  origins_hierarchy: { type: DataTypes.JSON, allowNull: true },
  purchase_places_tags: { type: DataTypes.JSON, allowNull: true },
  ingredients: { type: DataTypes.JSON, allowNull: true },
  traces_from_ingredients: { type: DataTypes.STRING, allowNull: true },
  last_editor: { type: DataTypes.STRING, allowNull: true },
  informers_tags: { type: DataTypes.JSON, allowNull: true },
  emb_codes_debug_tags: { type: DataTypes.JSON, allowNull: true },
  editors_tags: { type: DataTypes.JSON, allowNull: true },
  labels_tags: { type: DataTypes.JSON, allowNull: true },
  origins_tags: { type: DataTypes.JSON, allowNull: true },
  nutrition_data_per: { type: DataTypes.STRING, allowNull: true },
  origins: { type: DataTypes.STRING, allowNull: true },
  serving_size_debug_tags: { type: DataTypes.JSON, allowNull: true },
  ingredients_original_tags: { type: DataTypes.JSON, allowNull: true },
  ingredients_text_fr: { type: DataTypes.STRING, allowNull: true },
  stores: { type: DataTypes.STRING, allowNull: true },
  minerals_prev_tags: { type: DataTypes.JSON, allowNull: true },
  lang_debug_tags: { type: DataTypes.JSON, allowNull: true },
  link_debug_tags: { type: DataTypes.STRING, allowNull: true },
  traces: { type: DataTypes.STRING, allowNull: true },
  ecoscore_grade: { type: DataTypes.STRING, allowNull: true },
  data_quality_tags: { type: DataTypes.JSON, allowNull: true },
  created_t: { type: DataTypes.STRING, allowNull: true },
  added_countries_tags: { type: DataTypes.JSON, allowNull: true },
  amino_acids_prev_tags: { type: DataTypes.JSON, allowNull: true },
  last_updated_t: { type: DataTypes.STRING, allowNull: true },
  states: { type: DataTypes.STRING, allowNull: true },
  interface_version_created: { type: DataTypes.STRING, allowNull: true },
  product_name_debug_tags: { type: DataTypes.JSON, allowNull: true },
  ecoscore_tags: { type: DataTypes.JSON, allowNull: true },
  additives_tags: { type: DataTypes.JSON, allowNull: true },
  rev: { type: DataTypes.STRING, allowNull: true },
  ciqual_food_name_tags: { type: DataTypes.JSON, allowNull: true },
  nutrition_score_beverage: { type: DataTypes.STRING, allowNull: true },
  labels_old: { type: DataTypes.STRING, allowNull: true },
  brands_tags: { type: DataTypes.JSON, allowNull: true },
  pnns_groups_2: { type: DataTypes.STRING, allowNull: true },
  quantity_debug_tags: { type: DataTypes.JSON, allowNull: true },
  cities_tags: { type: DataTypes.JSON, allowNull: true },
  additives_n: { type: DataTypes.INTEGER, allowNull: true },
  photographers_tags: { type: DataTypes.JSON, allowNull: true },
  ingredients_text_fr_debug_tags: { type: DataTypes.JSON, allowNull: true },
  nutriscore_data: { type: DataTypes.JSON, allowNull: true },
  category_properties: { type: DataTypes.JSON, allowNull: true },
  amino_acids_tags: { type: DataTypes.JSON, allowNull: true },
  expiration_date_debug_tags: { type: DataTypes.JSON, allowNull: true },
  generic_name_en_debug_tags: { type: DataTypes.JSON, allowNull: true },
  expiration_date: { type: DataTypes.STRING, allowNull: true },
  data_quality_errors_tags: { type: DataTypes.JSON, allowNull: true },
  brands_debug_tags: { type: DataTypes.STRING, allowNull: true },
  nutriscore_2023_tags: { type: DataTypes.JSON, allowNull: true },
  other_nutritional_substances_tags: { type: DataTypes.JSON, allowNull: true },
  serving_quantity: { type: DataTypes.STRING, allowNull: true },
  ingredients_from_palm_oil_tags: { type: DataTypes.JSON, allowNull: true },
  ingredients_n: { type: DataTypes.INTEGER, allowNull: true },
  labels_hierarchy: { type: DataTypes.JSON, allowNull: true },
  ecoscore_data: { type: DataTypes.JSON, allowNull: true },
  pnns_groups_1: { type: DataTypes.STRING, allowNull: true },
  categories_hierarchy: { type: DataTypes.JSON, allowNull: true },
  product_name_fr_debug_tags: { type: DataTypes.JSON, allowNull: true },
  ingredients_without_ciqual_codes_n: { type: DataTypes.INTEGER, allowNull: true },
  creator: { type: DataTypes.STRING, allowNull: true },
  categories_properties: { type: DataTypes.JSON, allowNull: true },
  packaging_lc: { type: DataTypes.STRING, allowNull: true },
  food_groups_tags: { type: DataTypes.JSON, allowNull: true },
  quantity: { type: DataTypes.STRING, allowNull: true },
  serving_size: { type: DataTypes.STRING, allowNull: true },
  ingredients_text_with_allergens: { type: DataTypes.STRING, allowNull: true },
  sources: { type: DataTypes.JSON, allowNull: true },
  popularity_tags: { type: DataTypes.JSON, allowNull: true },
  data_sources_tags: { type: DataTypes.JSON, allowNull: true },
  purchase_places_debug_tags: { type: DataTypes.JSON, allowNull: true },
  traces_from_user: { type: DataTypes.STRING, allowNull: true },
  id: { type: DataTypes.STRING, allowNull: true },
  brands: { type: DataTypes.STRING, allowNull: true },
  max_imgid: { type: DataTypes.STRING, allowNull: true },
  packaging_old_before_taxonomization: { type: DataTypes.STRING, allowNull: true },
  pnns_groups_2_tags: { type: DataTypes.JSON, allowNull: true },
  main_countries_tags: { type: DataTypes.JSON, allowNull: true },
  nutrition_grades_tags: { type: DataTypes.JSON, allowNull: true },
  nutrition_score_warning_fruits_vegetables_legumes_estimate_from_ingredients_value: { type: DataTypes.STRING, allowNull: true },
  countries_lc: { type: DataTypes.STRING, allowNull: true },
  ingredients_from_palm_oil_n: { type: DataTypes.INTEGER, allowNull: true },
  manufacturing_places_tags: { type: DataTypes.JSON, allowNull: true },
  additives_old_tags: { type: DataTypes.JSON, allowNull: true },
  ingredients_analysis: { type: DataTypes.JSON, allowNull: true },
  no_nutrition_data: { type: DataTypes.STRING, allowNull: true },
  product_name_en_debug_tags: { type: DataTypes.JSON, allowNull: true },
  last_modified_by: { type: DataTypes.STRING, allowNull: true },
  lc: { type: DataTypes.STRING, allowNull: true },
  nucleotides_prev_tags: { type: DataTypes.JSON, allowNull: true },
  nutrient_levels: { type: DataTypes.JSON, allowNull: true },
  last_image_t: { type: DataTypes.STRING, allowNull: true },
  completeness: { type: DataTypes.STRING, allowNull: true },
  ingredients_that_may_be_from_palm_oil_tags: { type: DataTypes.JSON, allowNull: true },
  interface_version_modified: { type: DataTypes.STRING, allowNull: true },
  ingredients_text_debug_tags: { type: DataTypes.JSON, allowNull: true },
  purchase_places: { type: DataTypes.STRING, allowNull: true },
  checkers_tags: { type: DataTypes.JSON, allowNull: true },
  ingredients_text_debug: { type: DataTypes.STRING, allowNull: true },
  origins_old: { type: DataTypes.STRING, allowNull: true },
  nutriscore_version: { type: DataTypes.STRING, allowNull: true },
  nutrition_data_prepared: { type: DataTypes.STRING, allowNull: true },
  ingredients_without_ciqual_codes: { type: DataTypes.STRING, allowNull: true },
  product_name_fr: { type: DataTypes.STRING, allowNull: true },
  generic_name_fr: { type: DataTypes.STRING, allowNull: true },
  last_edit_dates_tags: { type: DataTypes.JSON, allowNull: true },
  additives_old_n: { type: DataTypes.INTEGER, allowNull: true },
  categories: { type: DataTypes.STRING, allowNull: true },
  ingredients_text: { type: DataTypes.STRING, allowNull: true },
  nova_group_debug: { type: DataTypes.STRING, allowNull: true },
  pnns_groups_1_tags: { type: DataTypes.JSON, allowNull: true },
  ingredients_n_tags: { type: DataTypes.JSON, allowNull: true },
  nutriscore_grade: { type: DataTypes.STRING, allowNull: true },
  additives_debug_tags: { type: DataTypes.JSON, allowNull: true },
  ingredients_tags: { type: DataTypes.JSON, allowNull: true },
  packagings_materials: { type: DataTypes.JSON, allowNull: true },
  data_quality_info_tags: { type: DataTypes.JSON, allowNull: true },
  packaging_recycling_tags: { type: DataTypes.JSON, allowNull: true },
  fruits_vegetables_nuts_100g_estimate: { type: DataTypes.STRING, allowNull: true },
  categories_lc: { type: DataTypes.STRING, allowNull: true },
  traces_hierarchy: { type: DataTypes.JSON, allowNull: true },
  categories_tags: { type: DataTypes.JSON, allowNull: true },
  states_hierarchy: { type: DataTypes.JSON, allowNull: true },
  nutrition_data_prepared_per_debug_tags: { type: DataTypes.JSON, allowNull: true },
  additives_original_tags: { type: DataTypes.JSON, allowNull: true },
  ingredients_with_specified_percent_n: { type: DataTypes.INTEGER, allowNull: true },
  origins_lc: { type: DataTypes.STRING, allowNull: true },
  emb_codes_tags: { type: DataTypes.JSON, allowNull: true },
  misc_tags: { type: DataTypes.JSON, allowNull: true },
  allergens_from_ingredients: { type: DataTypes.STRING, allowNull: true },
  data_sources: { type: DataTypes.JSON, allowNull: true },
  last_image_dates_tags: { type: DataTypes.JSON, allowNull: true },
  languages_codes: { type: DataTypes.JSON, allowNull: true },
  nutrition_data: { type: DataTypes.JSON, allowNull: true },
  ingredients_hierarchy: { type: DataTypes.JSON, allowNull: true },
  nutrition_data_per_debug_tags: { type: DataTypes.JSON, allowNull: true },
  packagings_n: { type: DataTypes.INTEGER, allowNull: true },
  known_ingredients_n: { type: DataTypes.INTEGER, allowNull: true },
  stores_debug_tags: { type: DataTypes.JSON, allowNull: true },
  ingredients_analysis_tags: { type: DataTypes.JSON, allowNull: true },
  ingredients_text_en: { type: DataTypes.STRING, allowNull: true },
  emb_codes: { type: DataTypes.STRING, allowNull: true },
  scans_n: { type: DataTypes.INTEGER, allowNull: true },
  traces_debug_tags: { type: DataTypes.JSON, allowNull: true },
  unique_scans_n: { type: DataTypes.INTEGER, allowNull: true },
  minerals_tags: { type: DataTypes.JSON, allowNull: true },
  ingredients_text_with_allergens_en: { type: DataTypes.STRING, allowNull: true },
  compared_to_category: { type: DataTypes.STRING, allowNull: true },
  product_name_en: { type: DataTypes.STRING, allowNull: true },
  update_key: { type: DataTypes.STRING, allowNull: true },
  generic_name_en: { type: DataTypes.STRING, allowNull: true },
  ingredients_with_unspecified_percent_n: { type: DataTypes.INTEGER, allowNull: true },
  nutriscore_2021_tags: { type: DataTypes.JSON, allowNull: true },
  languages_hierarchy: { type: DataTypes.JSON, allowNull: true },
  code: { type: DataTypes.STRING, allowNull: false },
  data_quality_bugs_tags: { type: DataTypes.JSON, allowNull: true },
  labels_lc: { type: DataTypes.STRING, allowNull: true },
  packaging_tags: { type: DataTypes.JSON, allowNull: true },
  labels: { type: DataTypes.STRING, allowNull: true },
  additives_prev_original_tags: { type: DataTypes.JSON, allowNull: true },
  nutrition_grade_fr: { type: DataTypes.STRING, allowNull: true },
  data_quality_warnings_tags: { type: DataTypes.JSON, allowNull: true },
  allergens_hierarchy: { type: DataTypes.JSON, allowNull: true },
  removed_countries_tags: { type: DataTypes.JSON, allowNull: true },
  _keywords: { type: DataTypes.JSON, allowNull: true },
  packaging_shapes_tags: { type: DataTypes.JSON, allowNull: true },
  nova_groups_tags: { type: DataTypes.JSON, allowNull: true },
  languages: { type: DataTypes.JSON, allowNull: true },
  allergens: { type: DataTypes.STRING, allowNull: true },
  unknown_nutrients_tags: { type: DataTypes.JSON, allowNull: true },
  debug_param_sorted_langs: { type: DataTypes.STRING, allowNull: true },
  packaging_old: { type: DataTypes.STRING, allowNull: true },
  vitamins_tags: { type: DataTypes.JSON, allowNull: true },
  states_tags: { type: DataTypes.JSON, allowNull: true },
  languages_tags: { type: DataTypes.JSON, allowNull: true },
  unknown_ingredients_n: { type: DataTypes.INTEGER, allowNull: true },
  generic_name_fr_debug_tags: { type: DataTypes.JSON, allowNull: true },
  packaging_hierarchy: { type: DataTypes.JSON, allowNull: true },
  codes_tags: { type: DataTypes.JSON, allowNull: true },
  nucleotides_tags: { type: DataTypes.JSON, allowNull: true },
  emb_codes_orig: { type: DataTypes.STRING, allowNull: true },
  traces_tags: { type: DataTypes.JSON, allowNull: true },
  food_groups: { type: DataTypes.JSON, allowNull: true },
  nutrition_data_prepared_per: { type: DataTypes.STRING, allowNull: true },
  categories_properties_tags: { type: DataTypes.JSON, allowNull: true },
  allergens_tags: { type: DataTypes.JSON, allowNull: true },
  nutrition_score_debug: { type: DataTypes.JSON, allowNull: true },
  popularity_key: { type: DataTypes.STRING, allowNull: true },
  stores_tags: { type: DataTypes.JSON, allowNull: true },
  countries_debug_tags: { type: DataTypes.JSON, allowNull: true },
  packaging: { type: DataTypes.JSON, allowNull: true },
  correctors_tags: { type: DataTypes.JSON, allowNull: true },
  allergens_from_user: { type: DataTypes.STRING, allowNull: true },
  tsv: { type: DataTypes.TSVECTOR, allowNull: true } 
}, {
  freezeTableName: true,
  timestamps: false,
  schema: 'public',
});

(async () => {
  await db.sync();
})();

export default Product;
