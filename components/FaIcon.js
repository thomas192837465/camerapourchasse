import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FA_ICONS } from "@/lib/icons-fa";

export default function FaIcon({ name, ...props }) {
  const icon = FA_ICONS[name];
  if (!icon) return null;
  return <FontAwesomeIcon icon={icon} {...props} />;
}
