import os
import time

from flask import (
    Blueprint,
    render_template,
    request
)

global_context = {
    'features': [
        {
            'url': '/01-dual-commander',
            'title': '01 - Dual Commander'
        },
        {
            'url': '/02-open-at-my-documents-a',
            'title': '02 - Open at My Documents (Part A)'
        },
        {
            'url': '/03-open-at-my-documents-b',
            'title': '03 - Open at My Documents (Part B)'
        },
    ]
}


def _get_template_name(req):
    name_with_slashes = req.url_rule.rule
    template_name = name_with_slashes.split('/')[1]

    return f"{template_name}.html"


def _folder_abs_path(folder_name):
    """
    Returns absolute path given folder name.

    Example:

    _folder_abs_path("static") => absolute path to static folder
    _folder_abs_path("media")  => absolute path to media folder
    """
    abs_path = os.path.join(
        os.path.dirname(__file__),
        '..',
        folder_name
    )

    return abs_path


# Mocks server responses for GET /folder/<int:folder_id>
FOLDERS = {
    -1: {
        'current_nodes': [
            {'title': 'invoice.pdf', 'id': 1, 'model': 'document'},
            {'title': 'payment_1.pdf', 'id': 2, 'model': 'document'},
            {'title': 'payment_2.pdf', 'id': 3, 'model': 'document'},
            {'title': 'My Documents', 'id': 4, 'model': 'folder'},
        ]
    },
    4: {
        # notice 'model' attribute which specifies type of node either document
        # or folder. There can be only two types of nodes: 'document' and
        # 'folder'
        'current_nodes': [
            {'title': 'mydoc1.pdf', 'id': 5, 'model': 'document'},
            {'title': 'mydoc2.pdf', 'id': 6, 'model': 'document'},
            {'title': 'Some Folder', 'id': 7, 'model': 'folder'},
        ],
        'breadcrumb': [
            {'id': 4, 'title': 'My Documents'}
        ]
    },
    7: {
        'current_nodes': [
            {'title': 'inv1.pdf', 'id': 8, 'model': 'document'},
            {'title': 'inv2.pdf', 'id': 9, 'model': 'document'},
            {'title': 'inv3.pdf', 'id': 10, 'model': 'document'},
            {'title': 'inv4.pdf', 'id': 11, 'model': 'document'},
        ],
        'breadcrumb': [
            {'id': 4, 'title': 'My Documents'},
            {'id': 7, 'title': 'Some Folder'}
        ]
    }
}

# Mocks server resonses for GET /document/<int:document_id>
DOCUMENT = {
    1: {
        'pages': [
            {
                'id': 1,
                'page_num': 1
            },
            {
                'id': 2,
                'page_num': 2
            },
            {
                'id': 3,
                'page_num': 3
            },
            {
                'id': 4,
                'page_num': 4
            }
        ],  # pages
    },
    2: {
        'pages': [
            {
                'id': 5,
                'page_num': 1
            },
        ],  # pages
    },
    3: {
        'pages': [
            {
                'id': 31,
                'page_num': 1
            },
            {
                'id': 32,
                'page_num': 2
            },
            {
                'id': 33,
                'page_num': 3
            },
            {
                'id': 34,
                'page_num': 4
            },
            {
                'id': 35,
                'page_num': 5
            },
            {
                'id': 36,
                'page_num': 6
            },
            {
                'id': 37,
                'page_num': 7
            }


        ],  # pages
    },
    5: {
        'pages': [
            {
                'id': 51,
                'page_num': 1
            },
            {
                'id': 52,
                'page_num': 2
            },
            {
                'id': 53,
                'page_num': 3
            },
            {
                'id': 54,
                'page_num': 4
            },
        ],  # pages
    },
    6: {
        'pages': [
            {
                'id': 61,
                'page_num': 1
            }
        ],
    },
    8: {
        'pages': [
            {
                'id': 81,
                'page_num': 1
            }, {
                'id': 82,
                'page_num': 2
            }, {
                'id': 83,
                'page_num': 3
            }
        ],
    },
    9: {
        'pages': [
            {
                'id': 91,
                'page_num': 1
            }, {
                'id': 92,
                'page_num': 2
            }, {
                'id': 93,
                'page_num': 3
            }, {
                'id': 94,
                'page_num': 4
            }, {
                'id': 95,
                'page_num': 5
            }
        ],
    },
    10: {
        'pages': [
            {
                'id': 101,
                'page_num': 1
            },
        ],  # pages
    },
    11: {
        'pages': [
            {
                'id': 111,
                'page_num': 1
            },
        ],  # pages
    },
}


def document_page_svg(doc_id, page_id):
    """
    Returns the SVG image (XML SVG content) of given page_id.

    It reads SVG file from media folder.
    """
    abs_path = _folder_abs_path("media")
    svg_file_path = os.path.join(
        abs_path,
        f"document-{doc_id}",
        f"page-{page_id}.svg"
    )

    # We have absolute path to the SVG file.
    # Now just read the actual file content.
    content = ""
    with open(svg_file_path, "r") as f:
        content = f.read()

    return content


def create_blueprint(name, request_delay=0):
    """
    Create a blueprint with options.

    A blueprint, in flask sense, is a reusable app in django's sense.
    `request_delay` is the number of seconds to delay handling of the
    request. With `request_delay` > 0 we simulate slow requests.
    """

    # Reusable app. It provides views for following URLS:
    #  - /
    #  - /folder/
    #  - /folder/<int:node_id>
    #  - /document/<int:node_id>
    blueprint = Blueprint(
        name,  # unique name
        name,  # import_name
        template_folder='templates',  # same folder as for the main app
        static_folder=_folder_abs_path("static")  # same as for main app

    )

    @blueprint.route('/')
    def browser():
        template_name = f"features/{_get_template_name(request)}"
        time.sleep(request_delay)
        return render_template(
            template_name,
            **global_context
        )

    @blueprint.route('/folder/')
    def browser_root_folder():
        time.sleep(request_delay)
        content_type = request.headers.get('Content-Type')
        if content_type and content_type == 'application/json':
            return FOLDERS.get(-1)

    @blueprint.route('/folder/<int:node_id>/')
    def browser_folder(node_id):
        time.sleep(request_delay)
        template_name = f"features/{_get_template_name(request)}"
        folder_dict = FOLDERS.get(node_id, None)
        if not folder_dict:
            return render_template("404.html"), 404

        content_type = request.headers.get('Content-Type')
        if content_type and content_type == 'application/json':
            return folder_dict

        return render_template(
            template_name, **folder_dict
        )

    @blueprint.route('/document/<int:node_id>')
    def browser_document(node_id):
        time.sleep(request_delay)
        template_name = f"features/{_get_template_name(request)}"
        document_dict = DOCUMENT.get(node_id, None)

        if not document_dict:
            return render_template("404.html"), 404

        content_type = request.headers.get('Content-Type')
        if content_type and content_type == 'application/json':
            return {'document': document_dict}

        return render_template(
            template_name,
            **document_dict
        )

    @blueprint.route('/document/<int:doc_id>/page/<int:page_id>')
    def browser_page(doc_id, page_id):

        time.sleep(request_delay)
        content_type = request.headers.get('Content-Type')
        if content_type and content_type == 'image/svg+xml':
            return document_page_svg(doc_id, page_id)

        return render_template("404.html"), 404

    @blueprint.route('/ocr-langs/')
    def ocr_langs():
        return {
            'ocr_langs': [
                {'title': 'Deutsch', 'value': 'deu'},
                {'title': 'English', 'value': 'eng'},
                {'title': 'Русский', 'value': 'rus'},
                {'title': 'Română', 'value': 'rom'},
            ]
        }

    return blueprint
