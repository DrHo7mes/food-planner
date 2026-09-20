/**
 * scripts/validate-db.js
 * اعتبارسنجی دیتابیس به صورت ES Module
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VALID_CATEGORIES = new Set([
  'protein', 'grain', 'legume', 'vegetable', 'herb', 'fruit',
  'dairy', 'nut', 'seed', 'spice', 'oil', 'condiment', 'baking', 'other'
]);
const VALID_UNITS = new Set(['g', 'kg', 'ml', 'l', 'piece', 'tbsp', 'tsp', 'cup']);

const ingPath = path.join(__dirname, '../src/data/ingredients.json');
const recPath = path.join(__dirname, '../src/data/recipes.json');

if (!fs.existsSync(ingPath) || !fs.existsSync(recPath)) {
  console.error('❌ فایل‌های دیتابیس یافت نشدند! ابتدا scripts/build-database.js را اجرا کنید.');
  process.exit(1);
}

const ingredients = JSON.parse(fs.readFileSync(ingPath, 'utf8'));
const recipes = JSON.parse(fs.readFileSync(recPath, 'utf8'));

let errors = [];
const ingredientIds = new Set();

// ۱. تست مواد اولیه
ingredients.forEach(ing => {
  if (ingredientIds.has(ing.id)) errors.push(`Duplicate ingredient id: ${ing.id}`);
  ingredientIds.add(ing.id);
  if (!VALID_CATEGORIES.has(ing.category)) errors.push(`Invalid category: ${ing.category} in ${ing.id}`);
  if (!VALID_UNITS.has(ing.unit)) errors.push(`Invalid unit: ${ing.unit} in ${ing.id}`);
});

// ۲. تست رسپی‌ها و ارجاعات
const recipeIds = new Set();
let orphanCount = 0;

recipes.forEach(rec => {
  if (recipeIds.has(rec.id)) errors.push(`Duplicate recipe id: ${rec.id}`);
  recipeIds.add(rec.id);

  rec.ingredients.forEach(item => {
    if (item.id !== item.ingredient_id) errors.push(`Key mismatch id vs ingredient_id in ${rec.id}`);
    if (item.amount !== item.quantity) errors.push(`Key mismatch amount vs quantity in ${rec.id}`);
    if (!ingredientIds.has(item.ingredient_id)) {
      orphanCount++;
      errors.push(`Orphan ingredient reference: '${item.ingredient_id}' in recipe '${rec.id}'`);
    }
  });
});

console.log('====================================');
console.log('📊 گزارش تست و اعتبارسنجی نهایی دیتابیس');
console.log('====================================');
console.log(`✅ مواد اولیه یکتا: ${ingredientIds.size}`);
console.log(`✅ رسپی‌های ثبت‌شده: ${recipeIds.size}`);
console.log(`🔍 خطاهای ارجاع یتیم (Orphans): ${orphanCount}`);
console.log(`⚠️ تعداد کل خطاهای ساختاری: ${errors.length}`);
console.log('====================================');

if (errors.length === 0) {
  console.log('نتیجه تست: ✅ PASS - دیتابیس کاملاً سالم، استاندارد و آماده استفاده است.');
} else {
  console.error('نتیجه تست: ❌ FAIL');
  console.error(errors.slice(0, 10));
}