<?php

global $wp_ozh_bpp;

function wp_ozh_bpp_reset() {
	update_option('update_plugins','');
	wp_redirect('plugins.php?force-check=true');
	exit;
}

function wp_ozh_bpp_init() {
	if ( !defined('WP_CONTENT_URL') )
		define( 'WP_CONTENT_URL', get_option('siteurl') . '/wp-content');
	if ( !defined('WP_PLUGIN_URL') )
		define( 'WP_PLUGIN_URL', WP_CONTENT_URL . '/plugins' );
	if ( !defined('WP_CONTENT_DIR') )
		define( 'WP_CONTENT_DIR', ABSPATH . 'wp-content' );
	if ( !defined('WP_PLUGIN_DIR') )
		define( 'WP_PLUGIN_DIR', WP_CONTENT_DIR . '/plugins' ); // full path, no trailing slash

	if (isset($_GET['action']) && $_GET['action'] == 'force-check') {
		check_admin_referer('force-check');
		wp_ozh_bpp_reset();
		die();
	}

	if ( isset($_GET['force-check']) ) {
		add_action('admin_notices', 'wp_ozh_bpp_refreshed');
	}
	
	$plugin_url = WP_PLUGIN_URL.'/'.plugin_basename(dirname(__FILE__));
	
	wp_enqueue_script('ozh_bpp', $plugin_url.'/plugin.js', array('jquery'));
	wp_enqueue_script('ozh_bpp_table', $plugin_url.'/jquery/jquery.tablesorter.min.js', array('jquery'));
	wp_enqueue_script('ozh_bpp_scroll', $plugin_url.'/jquery/jquery.scrollTo.min.js', array('jquery'));

	wp_enqueue_style('ozh_bpp', $plugin_url.'/plugin.css');
	
	add_action('admin_head','wp_ozh_bpp_js');
	
	add_action('admin_footer', 'wp_ozh_bpp_footer');
}

function wp_ozh_bpp_refreshed() {
	echo '<div id="message" class="updated fade"><p>Plugin check <strong>forced</strong></p></div>';
}


function wp_ozh_bpp_js() {
	$ozh_bpp_nonce = wp_nonce_url('plugins.php?action=force-check', 'force-check');
	echo '<script type="text/javascript">'."\n";
	echo "ozh_bpp_nonce = '$ozh_bpp_nonce';\n";
	echo '</script>'."\n";
}

function wp_ozh_bpp_footer() {
	echo <<<HTML
	<div id="bpp_wtf_msg" class="button-secondary">
	<p>This is the <a class="bpp_plugin" href="http://planetozh.com/blog/my-projects/wordpress-better-plugin-page/">Better Plugin Page</a> plugin, by <a class="byozh" href="http://planetozh.com">Ozh</a><br/>
	Thank you for using it!<br/>Please check my numerous other <a class="bpp_upg" href="http://planetozh.com/blog/my-projects/">WordPress plugins</a> :)</p>
	<span id="bpp_wtf_msg_close" class="button-secondary">Close</span>
	</div>
	<div id="bpp_wtf_mask">&nbsp;</div>
HTML;
}

?>
