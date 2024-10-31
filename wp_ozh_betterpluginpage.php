<?php
/*
Plugin Name: Ozh' Better Plugin Page
Plugin URI: http://planetozh.com/blog/my-projects/wordpress-better-plugin-page/
Description: Adds a little sliding plugin list and buttons to toggle display of Active/Inactive/Out-of-date plugins to the "Manage Plugins" page. For WordPress 2.8+
Author: Ozh
Author URI: http://planetozh.com/
Version: 1.4.2
*/

/* Release history:
   1.0    Initial Release
   1.0.1  Fixed: the plugin count was inaccurate
          Improved: the plugin count was also stupid :)
   1.2    Update for WP 2.6
   1.3    Update for WP 2.7
   1.4    Update for WP 2.8
   1.4.1  Better update for WP 2.8
   1.4.2  small JS fix
*/

global $wp_ozh_bpp;

add_action('load-plugins.php', 'wp_ozh_bpp_load', 1000);

function wp_ozh_bpp_load() {
	require_once(dirname(__FILE__).'/inc/plugin.php');
	wp_ozh_bpp_init();
}

?>