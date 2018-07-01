var labeledDataStructure = {
    "type": "varmap",
    "detail": {
        "type": "map",
        "detail": [
            {
                "type": "string",
                "name": "imagename"
            },
            {
                "type": "list",
                "detail": {
                    "type": "map",
                    "detail": [
                        {
                            "type": "string",
                            "name": "label"
                        },
                        {
                            "type": "list",
                            "detail": {
                                "type": "string"
                            },
                            "name": "values"
                        }
                    ]
                },
                "name": "attributes"
            },
            {
                "type": "list",
                "detail": {
                    "type": "string"
                },
                "name": "tags"
            },
            {
                "type": "map",
                "detail": [
                    {
                        "type": "number",
                        "name": "width"
                    },
                    {
                        "type": "number",
                        "name": "height"
                    }
                ],
                "name": "size"
            },
            {
                "type": "list",
                "detail": {
                    "type": "map",
                    "detail": [
                        {
                            "type": "string",
                            "name": "id"
                        },
                        {
                            "type": "string",
                            "name": "label"
                        },
                        {
                            "type": "string",
                            "name": "type"
                        },
                        {
                            "type": "list",
                            "detail": {
                                "type": "number"
                            },
                            "name": "points"
                        },
                        {
                            "type": "map",
                            "detail": [
                                {
                                    "type": "number",
                                    "name": "w"
                                },
                                {
                                    "type": "number",
                                    "name": "h"
                                },
                                {
                                    "type": "number",
                                    "name": "x2"
                                },
                                {
                                    "type": "number",
                                    "name": "y2"
                                },
                                {
                                    "type": "number",
                                    "name": "cx"
                                },
                                {
                                    "type": "number",
                                    "name": "cy"
                                },
                                {
                                    "type": "number",
                                    "name": "x"
                                },
                                {
                                    "type": "number",
                                    "name": "width"
                                },
                                {
                                    "type": "number",
                                    "name": "y"
                                },
                                {
                                    "type": "number",
                                    "name": "height"
                                }
                            ],
                            "name": "bbox"
                        },
                        {
                            "type": "list",
                            "detail": {
                                "type": "map",
                                "detail": [
                                    {
                                        "type": "string",
                                        "name": "label"
                                    },
                                    {
                                        "type": "list",
                                        "detail": {
                                            "type": "string"
                                        },
                                        "name": "values"
                                    }
                                ]
                            },
                            "name": "attributes"
                        },
                        {
                            "type": "list",
                            "detail": {
                                "type": "string"
                            },
                            "name": "tags"
                        },
                        {
                            "type": "list",
                            "detail": {
                                "type": "map",
                                "detail": [
                                    {
                                        "type": "number",
                                        "name": "x"
                                    },
                                    {
                                        "type": "number",
                                        "name": "y"
                                    },
                                    {
                                        "type": "string",
                                        "name": "label"
                                    },
                                    {
                                        "type": "string",
                                        "name": "id"
                                    }
                                ]
                            },
                            "name": "featurePoints"
                        }
                    ]
                },
                "name": "shapes"
            }
        ],
        "name": "amitkumargupta.work_riot.jpg"
    }
}

var nimnSchema = nimn.buildSchema(labeledDataStructure);