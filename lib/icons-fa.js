import {
  faEye,
  faBolt,
  faWifi,
  faBatteryFull,
  faTruck,
  faShieldHalved,
  faLocationDot,
  faCreditCard,
  faSnowflake,
  faCamera,
  faMoon,
  faMobileScreen,
  faLock,
  faClock,
  faLeaf,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

// Icônes disponibles pour les blocs "Promesse Technique" / "Garanties" — choisies dans l'admin
// par mot-clé (voir components/admin/IconPicker.js).
export const FA_ICONS = {
  eye: faEye,
  bolt: faBolt,
  wifi: faWifi,
  battery: faBatteryFull,
  truck: faTruck,
  shield: faShieldHalved,
  location: faLocationDot,
  card: faCreditCard,
  snowflake: faSnowflake,
  camera: faCamera,
  moon: faMoon,
  mobile: faMobileScreen,
  lock: faLock,
  clock: faClock,
  leaf: faLeaf,
  star: faStar,
};

export const FA_ICON_KEYS = Object.keys(FA_ICONS);
