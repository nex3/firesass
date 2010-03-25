require 'fileutils'

desc "Package FireSass as an XPI."
task :package do
  version = File.read("VERSION").strip

  puts "Packaging FireSass #{version}"

  FileUtils.mkdir_p('pkg')
  FileUtils.rm_rf('pkg/firesass-#{version}.xpi')
  sh %{zip -r pkg/firesass-#{version}.xpi . -x@.zipignore}
end

