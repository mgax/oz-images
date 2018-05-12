import app from './server';

app.set('oz-image-path', '/app/images');
app.listen(80, () => console.log('App running on port 80'));
