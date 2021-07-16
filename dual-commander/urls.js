import { UrlConf, path } from "@papermerge/symposium";


let urlpatterns = [
    path('folder/(:folder_id/)', 'folder'),
    path('document/:document_id/', 'document'),
],
prefix = '/core';

// there is only one UrlConf instance
let urlconf = new UrlConf({prefix, urlpatterns});


export { urlconf };