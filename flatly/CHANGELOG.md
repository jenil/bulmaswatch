# PR Changelog

Purpose: Remove hard-coded webfont import from \_overrides; implement
a mechanism to import primary webfont based on a variable, or, deliberately
chooce to use system font by not defining webfont import URL.

## Use case 1) Default: Import Webfont - in bulmaswatch.scss

	// Comment out $font-import-url + $font-import-name if system font stack is preferred
	$font-import-url: 'https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i' !default;
	$font-import-name: 'Lato';

	@import "variables";
	@import "bulma";
	@import "overrides";

Produces: 

	$ grep "import url" bulmaswatch.css 
	@import url("https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i");
	$ grep font-family bulmaswatch.css 
	  font-family: "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", "Helvetica", "Arial", sans-serif; }
	  font-family: "Inconsolata", "Consolas", "Monaco", monospace; }

## Use case 2) Use browser system font stack - in bulmaswatch.scss

	// Comment out $font-import-url + $font-import-name if system font stack is preferred
	// $font-import-url: 'https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i' !default;
	// $font-import-name: 'Lato';

	@import "variables";
	@import "bulma";
	@import "overrides";

Produces:

	$ grep "import url" bulmaswatch.css  # (none found)
	$ grep font-family bulmaswatch.css # (system font stack only)
	  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", "Helvetica", "Arial", sans-serif; }
	  font-family: "Inconsolata", "Consolas", "Monaco", monospace; }

## Use case 3) User imports theme components - in userproject.scss

	$font-import-url: 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,400i,700,700i' !default;
	$font-import-name: 'Source Sans Pro';
	@import "bulmaswatch/flatly/variables";
	@import "bulma";
	@import "bulmaswatch/flatly/overrides";

