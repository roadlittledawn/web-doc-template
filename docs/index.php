<?php 

$files = scandir('./');


echo '

<html>
	
	<head>

		
	</head>
	
	<body>
		
		<h1>Docs Index</h1>
		
		
		<div id="dir">';

		foreach ( glob("*.html") as $filename) {

			// eventually add check for first numbers and add tax term as header
					
			echo '
			<li class="index-toc">

				<a href="'. $filename.'" target="blank">'.$filename.'</a>

			</li>';
					
		}

		echo '

		</div>
	
	</body>
	
</html>';


?>