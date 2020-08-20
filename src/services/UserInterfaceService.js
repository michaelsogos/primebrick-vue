import { DrawerItem } from "../models/DrawerItem";
// eslint-disable-next-line no-unused-vars
import { MenuItem } from "../models/MenuItem";

export class UserInterfaceService {
	/**
	 *
	 * @param {MenuItem[]} menuItems
	 */
	static TransformMenuItemsToDrawerItems(menuItems) {
		/** @type {DrawerItem[]} */
		let drawerItems = [];

		for (let item of menuItems) {
			if (item.hidden) continue;

			if (item.left && !item.parent) {
				addItemToDrawer(item, drawerItems);
			}
		}

		return drawerItems;

		/**
		 *
		 * @param {MenuItem} menuItem
		 * @param {DrawerItem[]} branchItems
		 */
		function addItemToDrawer(menuItem, branchItems, baseIcon, baseColor) {
			baseIcon = menuItem.icon || baseIcon;
			baseColor = menuItem.iconBackground || baseColor;
			let drawerItem = new DrawerItem(
				menuItem.name,
				menuItem.title,
				menuItem.action,
				menuItem.icon,
				menuItem.iconBackground,
				baseIcon,
				baseColor
			);

			let nestedItems = menuItems.filter((i) => i.parent == menuItem.name);
			for (let item of nestedItems) {
				if (item.hidden) continue;

				addItemToDrawer(item, drawerItem.items, baseIcon, baseColor);
			}

			branchItems.push(drawerItem);
		}
	}
}
