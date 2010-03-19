package:
	mkdir -p pkg
	rm pkg/firesass-`cat VERSION`.xpi
	zip -r pkg/firesass-`cat VERSION`.xpi . -x '.git/*' -x 'pkg/*' -x .gitignore
