import { primaryNavigation } from "@/content/navigation";
import { NavigationLink } from "./NavigationLink";
import styles from "./DesktopNavigation.module.css";

export function DesktopNavigation() {
  return (
    <nav className={styles.navigation} aria-label="Navegação principal">
      <ul>
        {primaryNavigation.map((item) => (
          <li key={item.href}>
            <NavigationLink href={item.href}>{item.label}</NavigationLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
