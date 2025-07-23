const { src, dest } = require('gulp');

function buildIcons() {
    return src('icons/**/*.svg')
        .pipe(dest('dist/icons'));
}

exports['build:icons'] = buildIcons;
