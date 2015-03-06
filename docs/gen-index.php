<?php 

$files = scandir('./');

foreach (glob("*.html") as $filename) {
					
	$files .=  '<li class="index-toc"><a href="'. $filename.'">'.$filename.'</a></li>';
					
}

$html = '

<html>
	
	<head>

		
	</head>
	
	<body>
		
		<h1>Docs Map</h1>
		
		
		<div id="dir">'.

		$files.'

		</div>
	
	</body>
	
</html>
';

file_put_contents ('index.html', $html);

?>