# FireSass

FireSass is a Firebug extension
that makes Firebug display the Sass filenames and line numbers
of Sass-generated CSS styles
rather than those of the generated CSS.

**Currently FireSass only works with the development version of Sass,
available from [GitHub](http://github.com/nex3/haml).**

## Usage

First, install FireSass from [the Sass website](http://sass-lang.com/firesass.html).
Second, enable Sass's `:debug_info` option.
If you're using Sass with a Ruby web framework,
you probably want to do:

    Sass::Plugin.options[:debug_info] = true

If you're using Sass from the command line,
just pass in the `--debug-info` flag.
Finally, delete all the existing CSS files
so that they'll be regenerated.

## Compatibility

FireSass should work with all versions of Firefox after and including 3.0,
and all FireBug versions 1.4 and 1.5.
It might work with FireBug 1.6 (which is in development at time of writing),
but that's not guaranteed.

FireSass currently requires the development version of Sass,
available from [GitHub](http://github.com/nex3/haml).
