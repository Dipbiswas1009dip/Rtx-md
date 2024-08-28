const FormData = require('form-data');
const Jimp = require('jimp');

async function remini(imageBuffer, model) {
    return new Promise(async (resolve, reject) => {
        let models = ['enhance', 'recolor', 'dehaze'];
        model = models.includes(model) ? model : models[0];

        let form = new FormData();
        let url = `https://inferenceengine.ai/vyro/${model}`;

        form.append('model_version', 1, {
            'Content-Transfer-Encoding': 'binary',
            'contentType': 'multipart/form-data; charset=utf-8'
        });

        form.append('image', Buffer.from(imageBuffer), {
            'filename': 'enhance_image_body.jpg',
            'contentType': 'image/jpeg'
        });

        form.submit({
            'url': url,
            'host': 'inferenceengine.ai',
            'path': `/${model}`,
            'protocol': 'https:',
            'headers': {
                'User-Agent': 'okhttp/4.9.3',
                'Connection': 'Keep-Alive',
                'Accept-Encoding': 'gzip'
            }
        }, function(err, res) {
            if (err) reject();

            let chunks = [];
            res.on('data', function(chunk) {
                chunks.push(chunk);
            }).on('end', () => {
                resolve(Buffer.concat(chunks));
            }).on('error', (error) => {
                reject();
            });
        });
    });
}

module.exports.remini = remini;
