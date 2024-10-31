function ozh_bpp_count() {
	var count = jQuery('tr.bpp_pluginrow:visible').length / 2;
	jQuery('#bpp_counter').html(count+ ' plugins');
}

function ozh_bpp_make_plugin_list() {
	var plugins = {};
	var i=0;
	jQuery('tbody.plugins tr').not('.second').find('td.plugin-title').each(function(){
		i++;
		jQuery(this).attr('id','ozh_bpp_plugin_'+i);
		plugins[i] = jQuery(this).text();
	});
	plugins = ozh_bpp_sort_hash(plugins);
	var list = '';
	for (var index in plugins) {
		list = list + '<li><a href="#ozh_bpp_plugin_'+index+'">'+ plugins[index] + '</a></li>' ;
	}
	jQuery('.wrap:first').before('<div id="ozh_bpp_wrap"><div id="ozh_bpp"><ol>'+list +'</ol></div></div>');
	jQuery('#ozh_bpp li a').click(function(){
		ozh_bpp_scrollto(jQuery(this).attr('href'));
		return false;
	});
}

function ozh_bpp_scrollto(id) {
	jQuery.scrollTo(id, 100);
	var bg = jQuery(id).parent().css('background-color');
	jQuery(id).parent().animate({backgroundColor:'#ffa'}).animate({backgroundColor:bg});
}
	
function ozh_bpp_add_sliding_list() {
	ozh_bpp_make_plugin_list();
	jQuery('#ozh_bpp_wrap').mouseover(function() {
		jQuery(this).css('width','auto').css('overflow','auto');
	});
	jQuery('#ozh_bpp_wrap').mouseout(function(){
		jQuery(this).css('width','0px').css('overflow','hidden');
	});
}

function ozh_bpp_sort_hash(obj) {
	// convert Object into a sortable Array
	// {key1:"value1", key2:"value2"} => [ ["key1", "value1"] , ["key2", "value2"] ]
	var sortable = [];
	for (var index in obj)
		sortable.push([index, obj[index]])

	// Sort the array
	sortable.sort(function(a, b) {
		return (a[1].toUpperCase() < b[1].toUpperCase()) ? -1 : 1;
	});
	
	// Make new, sorted, object
	obj = {};
	for (var array in sortable) {
		// each (key,value) pair is (sortable[array][0], sortable[array][1])
		obj[sortable[array][0]] = sortable[array][1];
	}
	
	return obj;
}

function ozh_bpp_merge_table(table) {
	jQuery('#'+table+'-table tbody tr').each(function(){
		jQuery(this).clone().appendTo('#active-plugins-table tbody');
		jQuery(this).remove();
	});
	jQuery('#'+table+' + p').remove();
	jQuery('#'+table+' + form').remove();
	jQuery('#'+table).remove();
}

function ozh_bpp_sort_active() {
	jQuery("#active-plugins-table").tablesorter( {sortList:[[1,0]]});
}

function ozh_bpp_merge_tables() {
	ozh_bpp_merge_table('recent-plugins');
	ozh_bpp_merge_table('inactive-plugins');
	ozh_bpp_sort_active();
}

function ozh_bpp_wtf() {
	jQuery('html', 'body').css('overflow','hidden');
	jQuery('#bpp_wtf_mask').css({display:'block',opacity:0}).fadeTo("300", 0.8).click(function(){ozh_bpp_wtf_hide()});
	var totalw = jQuery(window).width();
	var totalh = jQuery(window).height();
	var msgw = jQuery('#bpp_wtf_msg').css('width').replace('px','');
	var msgh = jQuery('#bpp_wtf_msg').css('height').replace('px','');
	jQuery('#bpp_wtf_msg')
		.css({left:parseInt((totalw-msgw)/2)+'px', top:parseInt((totalh-msgh)/2)+'px'})
		.fadeIn('slow');
}

function ozh_bpp_wtf_hide() {
	jQuery('#bpp_wtf_mask').fadeOut('slow');
	jQuery('#bpp_wtf_msg').fadeOut('slow');
	jQuery('html','body').css('overflow','');
}
	
jQuery(document).ready(function() {
	if (!jQuery.browser.msie) {
		ozh_bpp_add_sliding_list();
	}

	var show = {
		"inactive": true,
		"active": true, 
		"outdated": true,
		"uptodate": true
	};
	// Add buttons
	jQuery('div.tablenav:first div.alignleft:last')
		.after('<div class="alignright" id="bpp_counter"></div>')
		.after('<div class="alignright"><a class="button-secondary bpp_button" href="plugins.php" id="bpp_wtf">?</a></div>')
		//.after('<div class="alignleft"><a class="button-secondary bpp_button" href="plugins.php" id="bpp_merge">Merge Tables</a></div>')
		.after('<div class="alignleft"><a class="button-secondary bpp_button" href="plugins.php" id="bpp_allrows">Show all</a></div>')
		.after('<div class="alignleft"><a class="button-secondary bpp_button" href="plugins.php" id="bpp_uptodate">Hide uptodate</a></div>')
		.after('<div class="alignleft"><a class="button-secondary bpp_button" href="plugins.php" id="bpp_active">Hide active</a></div>')
		.after('<div class="alignleft"><a class="button-secondary bpp_button" href="plugins.php" id="bpp_inactive">Hide inactive</a></div>')
		.after('<div class="alignleft"><a class="button-secondary bpp_button" id="bpp_force" href="'+ozh_bpp_nonce+'">Force plugin checks</a></div>');
	// Button behavior togglage
	jQuery('.bpp_button').click(function(){
		var id = jQuery(this).attr('id').replace('bpp_','');
		switch (id) {
		case 'allrows':
			jQuery('.widefat .plugins tr').each(function(){
				jQuery(this).show();
			});		
		break;
		
		case 'merge':
			ozh_bpp_merge_tables();
			jQuery(this).hide();
		break;
		
		case 'wtf':
			ozh_bpp_wtf();
		break;

		default:
			show[id] = !show[id];
			var text = (show[id]) ? 'Hide ' : 'Show ';
			jQuery(this).html(text+id);
			jQuery('.widefat .plugins tr').each(function(){
				if (jQuery(this).is('.'+id)) {
					jQuery(this).toggle();
				}
			});
		break;
		}
		ozh_bpp_count();
		return false;
		
	});
	// Change action links appearance
	jQuery('td.action-links').each(function(){
		// first pass: all links get class bpp_edit (to style links that plugins add, for instance)
		jQuery(this).find('a').addClass('bpp_edit');
		// second pass: a few more precise conditions
		jQuery(this)
			.find('a.edit[href^=plugin-editor.php]').removeClass('bpp_edit').addClass('bpp_edit').end()
			.find('a.edit[href*=action=activate]').removeClass('bpp_edit').addClass('bpp_activate').end()
			.find('a.delete').removeClass('bpp_edit').addClass('bpp_deactivate');
		var html = jQuery(this).html();
		jQuery(this).html(html.replace(/\|/g,' '));
	});
	// Mark plugin row (make them distinct from the "update plugin" rows
	jQuery('td.plugin-title').each(function(){
		jQuery(this).parent().addClass('bpp_pluginrow');
	});
	// Mark outdated rows
	var i=0;
	jQuery('.plugin-update-tr').each(function(){
		var details = jQuery(this).find('a:first').attr('href');
		var detailshtml = jQuery(this).find('a:first').html();
		var upg = jQuery(this).find('a:last').attr('href');
		var upghtml = jQuery(this).find('a:last').html();
		var newversion = detailshtml.match(/\d[^\ ]+/g); // find first number followed by anything but a space
		jQuery(this).attr('id', 'ozh_'+i++);
		//console.log(newversion, upg, zip);
		/**/
		jQuery(this)
			//.parent()
			.addClass('outdated bpp_updaterow')
			.html('')
			.prev().prev()
			.addClass('outdated')
			.next()
			.addClass('outdated')
			.find('td.desc')
				//.wrapInner('<span class="bpp_vers"></span>')
				//.end()
				//.find('td:nth-child(4)')
				.append('<span class="bpp_newversion"><span><a class="bpp_zip thickbox" href="'+details+'">Details</a></span> <span><a class="bpp_upg" href="'+upg+'" title="'+upghtml+'">Upgrade</a></span> &rarr; <b>'+newversion[0]+'</b></span>');
		/**/
	});
	tb_init('a.thickbox');
	// Mark inactive and uptodate rows
	jQuery('.widefat .plugins tr').each(function(){
		if (!jQuery(this).is('.outdated')) {jQuery(this).addClass('uptodate')}
		if (!jQuery(this).is('.active')) {jQuery(this).addClass('inactive')}
	});
	jQuery('#bpp_wtf_msg_close').click(function(){
		ozh_bpp_wtf_hide();
	});

	ozh_bpp_count();
});	