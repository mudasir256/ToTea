// Import all menu images
import AvocadoSmoothie from '@/assets/AvocadoSmoothie.jpg';
import BrownSugarMilk from '@/assets/BrownSugarMilk.jpg';
import BrownSugarMilkTea from '@/assets/BrownSugarMilkTea.webp';
import ClassicMilkTea from '@/assets/ClassicMilkTea.jpg';
import CremeBruleeBrownSugarMilk from '@/assets/CrèmeBrûléeBrownSugarMilk.webp';
import EggCream from '@/assets/EggCream.webp';
import EggVietnameseCoffee from '@/assets/EggVietnameseCoffee.png';
import GrapefruitTea from '@/assets/GrapefruitTea.webp';
import HoneydewMilkTea from '@/assets/HoneydewMilkTea.webp';
import HorchataMilkTea from '@/assets/HorchataMilkTea.webp';
import MangoMilkTea from '@/assets/MangoMilkTea.webp';
import MangoSagoCoconutMilk from '@/assets/MangoSagoCoconutMilk.webp';
import MatchaCream from '@/assets/MatchaCream.jpg';
import MatchaLatte from '@/assets/MatchaLatte.jpg';
import MatchaSmoothie from '@/assets/MatchaSmoothie.jpg';
import PeachOolongTea from '@/assets/PeachOolongTea.jpeg';
import PistachioMilkTea from '@/assets/PistachioMilkTea.webp';
import RoastedOolongMilkTea from '@/assets/RoastedOolongMilkTea.jpg';
import SeaSaltCream from '@/assets/SeaSaltCream.jpg';
import SeaSaltJasmineTea from '@/assets/SeaSaltJasmineTea.jpg';
import StrawberryMatchaLatte from '@/assets/StrawberryMatchaLatte.jpg';
import StrawberryPassionfruitTea from '@/assets/StrawberryPassionfruitTea.jpg';
import ThaiMilkTea from '@/assets/ThaiMilkTea.jpg';
import UbeCream from '@/assets/UbeCream.jpg';
import UbeMilkTea from '@/assets/UbeMilkTea.webp';
import UbeSmoothie from '@/assets/UbeSmoothie.webp';
import UbeVietnameseCoffee from '@/assets/UbeVietnameseCoffee.jpg';
import VietnameseSeaSaltCoffee from '@/assets/VietnameseSeaSaltCoffee.png';
// Import topping images
import HoneyBoba from '@/assets/honeyboba.webp';
import Jelly from '@/assets/Jelly.webp';
import SeaSaltCreamTopping from '@/assets/SeaSaltCream.jpg';
import UbeCreamTopping from '@/assets/UbeCream.jpg';
import MatchaCreamTopping from '@/assets/MatchaCream.jpg';
import EggCreamTopping from '@/assets/EggCream.webp';

// Map menu item names to their corresponding images
export const menuImageMap: Record<string, string> = {
  'Vietnamese Sea Salt Coffee': VietnameseSeaSaltCoffee,
  'Ube Vietnamese Coffee': UbeVietnameseCoffee,
  'Egg Vietnamese Coffee': EggVietnameseCoffee,
  'Brown Sugar Milk': BrownSugarMilk,
  'Brown Sugar Milk Tea': BrownSugarMilkTea,
  'Crème Brûlée Brown Sugar Milk': CremeBruleeBrownSugarMilk,
  'Classic Milk Tea': ClassicMilkTea,
  'Thai Milk Tea': ThaiMilkTea,
  'Roasted Oolong Milk Tea': RoastedOolongMilkTea,
  'Ube Milk Tea': UbeMilkTea,
  'Pistachio Milk Tea': PistachioMilkTea,
  'Horchata Milk Tea': HorchataMilkTea,
  'Mango Milk Tea': MangoMilkTea,
  'Honeydew Milk Tea': HoneydewMilkTea,
  'Matcha Latte': MatchaLatte,
  'Strawberry Matcha Latte': StrawberryMatchaLatte,
  'Mango Matcha Latte': MangoMilkTea, // Using Mango Milk Tea as fallback
  'Coconut Matcha': MatchaLatte, // Using Matcha Latte as fallback
  'Sea Salt Jasmine Tea': SeaSaltJasmineTea,
  'Peach Oolong Tea': PeachOolongTea,
  'Strawberry Passionfruit Tea': StrawberryPassionfruitTea,
  'Grapefruit Tea': GrapefruitTea,
  'Mango Sago Coconut Milk': MangoSagoCoconutMilk,
  'Avocado Smoothie': AvocadoSmoothie,
  'Ube Smoothie': UbeSmoothie,
  'Matcha Smoothie': MatchaSmoothie,
};

// Helper function to get image for a menu item
export const getMenuImage = (itemName: string): string | undefined => {
  return menuImageMap[itemName];
};

// Map topping names to their corresponding images
export const toppingImageMap: Record<string, string> = {
  'Honey Boba': HoneyBoba,
  'Jelly': Jelly,
  'Sea Salt Cream': SeaSaltCreamTopping,
  'Ube Cream': UbeCreamTopping,
  'Matcha Cream': MatchaCreamTopping,
  'Egg Cream': EggCreamTopping,
};

// Helper function to get image for a topping
export const getToppingImage = (toppingName: string): string | undefined => {
  return toppingImageMap[toppingName];
};
