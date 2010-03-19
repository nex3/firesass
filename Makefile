package:
	mkdir -p pkg
	rm -f pkg/firesass-`cat VERSION`.xpi
	zip -r pkg/firesass-`cat VERSION`.xpi . -x@.zipignore
