# https://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules
drone-publish:
	echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc	
	npm publish