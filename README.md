# FireSass

FireSass is a Firebug extension
that makes Firebug display the Sass filenames and line numbers
of Sass-generated CSS styles
rather than those of the generated CSS.

![Screenshot](http://github.com/nex3/firesass/raw/master/skin/screenshot.png)

## Usage

First, [install FireSass](https://addons.mozilla.org/en-US/firefox/addon/103988).
Second, enable Sass's `:debug_info` option.
If you're using Sass with a Ruby web framework,
you probably want to do:

    Sass::Plugin.options[:debug_info] = true

Add this to `config/environment.rb` in Rails,
or `config.ru` in other Ruby frameworks.

If you're using [Compass](http://compass-style.org/docs/), instead do:

    sass_options = {:debug_info => true}

Add this to `config/compass.rb`, or wherever else your Compass configuration file is.

If you're using Sass from the command line,
just pass in the `--debug-info` flag.
Finally, delete all the existing CSS files
so that they'll be regenerated.

## Compatibility

FireSass requires Sass 3.0 or later.

FireSass should work with all versions of Firefox after and including 3.0,
and all FireBug versions 1.4 and 1.5.
It might work with FireBug 1.6 (which is in development at time of writing),
but that's not guaranteed.

FireSass currently requires the development version of Sass,
available from [GitHub](http://github.com/nex3/haml).
