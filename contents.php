<?php 

$files = scanDir('./');

foreach (glob("*.html") as $filename) {
					
	$files .=  '<li><a href="'. $filename.'">'.$filename.'</a></li>';
					
}

$html = '

<html>
	
	<head>

		
	</head>
	
	<body>
		
		<h1>Content Index</h1>
		
		
		<div id="dir">'.

		$files.'

		</div>
	
	</body>
	
</html>
';

file_put_contents ('index.html', $html);

?>