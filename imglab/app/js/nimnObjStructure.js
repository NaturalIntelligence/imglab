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
                "name": "attributes",
                "type": "list",
                "detail": {
                    "type": "map",
                    "detail": [
                        {
                            "type": "string",
                            "name": "label"
                        },
                        {
                            "type": "string",
                            "name": "values"
                        }
                    ]
                }
            },
            {
                "name": "tags",
                "type": "list",
                "detail": {
                    "type": "string"
                }
            },
            {
                "name": "size", //image size
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
                ]
            },
            {
                "name": "shapes",
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
                            "name": "category" //class, type
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
                            "name": "points",
                            "type": "list",
                            "detail": {
                                "type": "number"
                            },
                        },
                        {
                            "name": "bbox",
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
                            
                        },
                        {
                            "name": "attributes",
                            "type": "list",
                            "detail": {
                                "type": "map",
                                "detail": [
                                    {
                                        "type": "string",
                                        "name": "label"
                                    },
                                    {
                                        "type": "string",
                                        "name": "values"
                                    }
                                ]
                            }
                            
                        },
                        {
                            "name": "tags",
                            "type": "list",
                            "detail": {
                                "type": "string"
                            }
                        },
                        {
                            "name": "featurePoints",
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
                            
                        }
                    ]
                },
                
            }
        ],
        "name": "amitkumargupta.work_riot.jpg"
    }
}

var nimnSchema = nimn.buildSchema(labeledDataStructure);