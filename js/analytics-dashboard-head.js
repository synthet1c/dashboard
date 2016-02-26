google.load( "visualization", "1.1", { packages: [ "bar", "corechart" ] } );

function drawChart( id, $panel ){

	document.getElementById( id ).innerHTML = "";

	var
		type = $panel.data( 'gatype' ) || 'bar';

	switch( type ){
		case 'pie':
			if( $panel instanceof jQuery && ($panel.attr( 'data-sizex' ) < 3 || $panel.attr( 'data-sizey' ) < 3) ){
				document.getElementById( id ).appendChild( createTable( $panel.data( 'gadata' ) ) );
				return;
			}
			break;
		case 'bar':
			if( $panel instanceof jQuery && ($panel.attr( 'data-sizex' ) < 5 || $panel.attr( 'data-sizey' ) < 7) ){
				document.getElementById( id ).appendChild( createTable( $panel.data( 'gadata' ) ) );
				return;
			}
			break;
	}

	var
		data        = new google.visualization.arrayToDataTable( $panel.data( 'gadata' ) ),
		$innerPanel = $panel.find( '.panel__content' );

	var options = {
		bar: {
			width : $innerPanel.width() - 10,
			height: $innerPanel.height() - 10,
			chart : {
				title   : 'Nearby galaxies',
				subtitle: 'distance on the left, brightness on the right'
			},
			bars  : 'horizontal', // Required for Material Bar Charts.
			series: {
				0: { axis: 'distance' }, // Bind series 0 to an axis named 'distance'.
				1: { axis: 'brightness' } // Bind series 1 to an axis named 'brightness'.
			},
			axes  : {
				x: {
					distance  : { label: 'parsecs' }, // Bottom x-axis.
					brightness: { side: 'top', label: 'apparent magnitude' } // Top x-axis.
				}
			}
		},
		pie: {
			title : 'My Daily Activities',
			width : $innerPanel.width() - 20,
			height: $innerPanel.height() - 20
		}
	};

	switch( type ){
		case 'pie':
			chart = new google.visualization.PieChart( document.getElementById( id ) );
			break;
		default:
			chart = new google.charts.Bar( document.getElementById( id ) );
	}

	chart.draw( data, options[ type ] );
}

function createTable( arr ){
	var
		frag    = document.createDocumentFragment(),
		table   = document.createElement( 'table' ),
		thead   = document.createElement( 'thead' ),
		tbody   = document.createElement( 'tbody' ),
		arrCopy = arr.slice( 0 ),
		headers = arrCopy.splice( 0, 1 );

	console.log( headers[ 0 ] );

	table.className = 'table-responsive';

	frag.appendChild( table );
	table.appendChild( thead );
	table.appendChild( tbody );

	thead.appendChild( createRow( headers[ 0 ], headers[ 0 ], 'th' ) );

	arrCopy.forEach( function( row ){
		tbody.appendChild( createRow( row, headers[ 0 ] ) );
	} );

	return frag;
}

function createRow( data, headers, type ){
	var row = document.createElement( 'tr' );

	data.forEach( function( data, ii ){
		var td = document.createElement( type || 'td' );
		td.appendChild( document.createTextNode( data ) );
		td.setAttribute( 'data-heading', headers[ ii ] );
		row.appendChild( td );
	} );
	return row;
}