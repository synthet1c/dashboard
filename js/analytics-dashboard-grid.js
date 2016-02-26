$( function(){ //DOM Ready

	var
		$layout             = $('.layout > .content'),
		width               = (1200 - (20 * 12) ) / 12,
		height              = (565 - (20 * 12) ) / 12,
	    $document           = $(document),
	    $body               = $(document.body),
	    $panelItems         = $( '.panel__item' ),
		$contextMenu        = $( '.context_menu' ),
		$contextMenuInner   = $( '.context_menu--inner' ),
		$contextItem        = $('.context_menu__item' ),
	    menuOpen            = false,
		focusedPanel        = null;

	var gridster = $( ".gridster ul" ).gridster({
		widget_margins        : [ 10, 10 ],
		widget_base_dimensions: [ width, height ],
		min_cols              : 12,
		max_cols              : 12,
		min_rows              : 12,
		max_rows              : 12,
		resize                : {
			enabled: true,
			stop: resizeWidgetCallback
		},
		serialize_params: serializeParams
	}).data('gridster');

	function resizeWidgetCallback( e, $panel, $widget ){

		var
			sizeX = $widget.attr('data-sizex'),
		    widgetSize = sizeX <= 4 ? 'small' : sizeX <= 8 ? 'medium': 'large';

		console.log( 'sizex', sizeX );

		$widget.attr('data-widget-size', widgetSize);

		drawChart( $widget.data( 'gaid' ), $widget );
	}

	function serializeParams( $widget, widget ){
		return {
			html: $widget.find('.panel__content').html(),
			name: $widget.find('.widget-name').text(),
			col: widget.col,
			row: widget.row,
			size_x: widget.size_x,
			size_y: widget.size_y
		}
	}

	var widgets = {
		families: {
			content: {
				visitorsSummary: { text: 'Visitors Summary', width: 8, height: 12, type: 'bar' },
				topPages       : { text: 'Top Pages', width: 4, height: 4, type: 'bar' },
				visitors       : { text: 'Visitors', width: 4, height: 4, type: 'bar' },
				referrals      : { text: 'Referrals', width: 4, height: 4, type: 'bar' },
				socials        : { text: 'Socials', width: 4, height: 4, type: 'pie' },
				keywords       : { text: 'Keywords', width: 4, height: 4, type: 'bar' },
				devices        : { text: 'Devices', width: 4, height: 4, type: 'pie' }
			},
			connections: {
				connectionsSummary  : { text: 'Connections Summary', width: 8, height: 2, type: 'bar'},
				userEngagement      : { text: 'Users Engagement', width: 4, height: 4, type: 'bar'},
				userByGender        : { text: 'Users By Gender', width: 4, height: 4, type: 'bar'},
				userByAgeGroup      : { text: 'Users By Age Group', width: 4, height: 4, type: 'bar'},
				registrationActivity: { text: 'Registration Activity', width: 4, height: 4, type: 'bar'},
				pubuserGroups       : { text: 'Pubuser Groups', width: 4, height: 4, type: 'bar'},
				visitorsLocation    : { text: 'Visitors Location', width: 4, height: 4, type: 'bar'}
			},
			interactions: {
				interactionSummary : { text: 'Interaction Summary', width: 8, height: 2, type: 'bar' },
				recentBlogPosts     : { text: 'Recent Blog Posts', width: 4, height: 4, type: 'bar' },
				visitorsEngagement   : { text: 'Visitors Engagement', width: 4, height: 4, type: 'bar' },
				recentNewsletters   : { text: 'Recent Newsletters', width: 4, height: 4, type: 'bar' },
				visitorsLocationCity: { text: 'Visitors Location City', width: 4, height: 4, type: 'bar' },
				socialReferrals     : { text: 'Social Referrals', width: 4, height: 4, type: 'bar' },
				socials             : { text: 'Socials', width: 4, height: 4, type: 'bar' }
			},
			transactions: {
				ecommerceSummary : { text: 'eCommerce Summary', width: 8, height: 2, type: 'bar' },
				recentOrders     : { text: 'Recent Orders', width: 4, height: 4, type: 'bar' },
				bestSellers      : { text: 'Best Sellers', width: 4, height: 4, type: 'bar' },
				revenueByCategory: { text: 'Revenue By Category', width: 4, height: 4, type: 'bar' }
			}
		}
	};

	$(".gridster, .gridster ul" ).width( $layout.width() + 'px');

	$document.on( 'contextmenu', '.panel__item, .context_menu, .panel', noBubble(onlyRightClick(contextMenuToggle)));

	$contextMenu.on('click', noBubble(contextMenuToggle));

	function contextMenuToggle( e ){
		$body.toggleClass( 'show--context-menu' );
		focusedPanel = $(e.target).closest('.panel__item');
		$contextMenuInner.css({
			left: e.clientX - 16,
			top : e.clientY - 16 + window.scrollY
		});
	}

	var
		barTemplateFetch = template('#panel__content--template--bar'),
		pieTemplateFetch = template('#panel__content--template--pie');

	function templateFetch( type, data ){
		switch( type ){
			case 'pie':
				return pieTemplateFetch.call(this, data);
			default: // bar
				return barTemplateFetch.call(this, data);
		}
	}

	$contextMenu.find('.remove').on('click', noBubble(hideMenu(function( e ){
		gridster.remove_widget( focusedPanel );
		// contextMenuToggle.apply(this, arguments);
	})));



	$('.widget_ribbon--item').on('click', noBubble(hideMenu(hideRibbonWidget(addWidgetCallback))));

	$contextMenu.find('.context_menu--sub-sub--item').on('click', noBubble(hideMenu(addWidgetCallback)));

	$contextMenu.find('.save').on('click', noBubble(hideMenu(function( e ){
		console.log( gridster.serialize() );
	})));

	function hideRibbonWidget( fn ){
		return function(e){
			$( e.target ).addClass('hide');
			return fn.apply(this, arguments);
		}
	}

	function addWidgetCallback( e ){
		var
			$item = $( e.target ),
			data  = $item.data(),
			params = widgets.families[ data.family ][ data.id ],
			template = templateFetch( params.type, {
				heading: params.text,
				content: 'this is the content for the widget',
				family : data.family,
				id     : data.id

			}),
			$panel = gridster.add_widget( template, params.width, params.height ),
			$chart    = $( '#' + data.id );

		$panel.attr('data-gaid', data.id );
		$panel.attr('data-gatype', params.type );

		//$chart.width( $chart.parent().width() );
		//$chart.height( $chart.parent().height() );
		drawChart( data.id, $panel, params );
	}

	// notes:
	// ga-chart pie [[key, value], [key, value]];
	// ga-chart bar [[header, header],[data, data], [data, data]]

	function template( selector ){
		var template = $( selector ).html();
		return function templateReplace( vars ){
			return template
				.replace(/((?:\n|\t)+)/gm, '')
				.replace(/\{\{\s*(\w+)\s*}}/gim, function(_, key ){
					return vars[key] || '';
				});
		}
	}


	function hideMenu( fn ){
		return function hideMenu( e ){
			$body.removeClass('show--context-menu');
			return fn.apply( this, arguments );
		}
	}

	function onlyRightClick( fn ){
		return function( e ){
			if( e.which === 3 || e.button === 2 ){
				return fn.apply(this, arguments);
			}
		}
	}

	function noBubble(fn){
		return function( e ){
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
			return fn.apply(this, arguments);
		}
	}

	function compose(a,b){
		return function(c){
			return a(b(c));
		}
	}

} );