VERSION=${GALEB_VERSION}
RELEASE=$(shell date +%y%m%d%H%M)

dist:
	fpm -s dir \
		--rpm-rpmbuild-define '_binaries_in_noarch_packages_terminate_build 0' \
		-t rpm \
		-n "galeb-new-webui" \
		-v ${VERSION} \
		--iteration ${RELEASE}.el7 \
		-a noarch \
		--rpm-os linux \
		-m 'Galeb <galeb@corp.globo.com>' \
		--url 'http://galeb.io' \
		--vendor 'Globo.com' \
		--description "Galeb WebUI Service" \
		-f -p galeb-new-webui-${VERSION}.el7.noarch.rpm css=/opt/galeb/htdocs/ img=/opt/galeb/htdocs/ index.html=/opt/galeb/htdocs/ scripts=/opt/galeb/htdocs/ views=/opt/galeb/htdocs/
