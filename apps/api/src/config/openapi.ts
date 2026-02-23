export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'VocabMaster API',
    version: '0.1.0',
    description: 'Auth and learning endpoints for the VocabMaster mobile app.'
  },
  servers: [{ url: 'http://localhost:3000' }],
  tags: [{ name: 'Health' }, { name: 'Auth' }, { name: 'Learning' }, { name: 'Reading' }, { name: 'Search' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      ApiError: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
              details: {}
            },
            required: ['code', 'message']
          }
        },
        required: ['error']
      },
      AuthRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 }
        },
        required: ['email', 'password']
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: { type: 'string' }
        },
        required: ['token']
      },
      CefrLevel: {
        type: 'string',
        enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
      },
      WordState: {
        type: 'string',
        enum: ['Known', 'Learning', 'Forgotten']
      },
      Topic: {
        type: 'string',
        enum: [
          'Daily Life',
          'Travel & Transportation',
          'Food & Dining',
          'Business',
          'Work',
          'Education',
          'Health & Medicine',
          'Technology',
          'Arts & Culture',
          'Nature & Environment',
          'Sports & Hobbies',
          'Emotions & Feelings',
          'Time & Dates'
        ]
      },
      TargetLevelResponse: {
        type: 'object',
        properties: {
          level: {
            anyOf: [{ $ref: '#/components/schemas/CefrLevel' }, { type: 'null' }]
          }
        },
        required: ['level']
      },
      SetTargetLevelRequest: {
        type: 'object',
        properties: {
          level: { $ref: '#/components/schemas/CefrLevel' }
        },
        required: ['level']
      },
      LearningWord: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          text: { type: 'string' },
          meaning: { type: 'string' },
          phonetic: { type: 'string' },
          audio: { type: 'string' },
          example: { type: 'string' },
          topic: { type: 'string' },
          partOfSpeech: { type: 'string' },
          level: { $ref: '#/components/schemas/CefrLevel' },
          state: {
            anyOf: [{ $ref: '#/components/schemas/WordState' }, { type: 'null' }]
          }
        },
        required: ['id', 'text', 'meaning', 'phonetic', 'audio', 'example', 'topic', 'partOfSpeech', 'level', 'state']
      },
      SessionWordsResponse: {
        type: 'object',
        properties: {
          words: {
            type: 'array',
            items: { $ref: '#/components/schemas/LearningWord' }
          }
        },
        required: ['words']
      },
      UpdateWordStateRequest: {
        type: 'object',
        properties: {
          state: { $ref: '#/components/schemas/WordState' }
        },
        required: ['state']
      },
      UpdateWordStateResponse: {
        type: 'object',
        properties: {
          wordId: { type: 'string' },
          state: { $ref: '#/components/schemas/WordState' }
        },
        required: ['wordId', 'state']
      },
      ForgottenWord: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          text: { type: 'string' },
          meaning: { type: 'string' },
          phonetic: { type: 'string' },
          audio: { type: 'string' },
          example: { type: 'string' },
          topic: { type: 'string' },
          partOfSpeech: { type: 'string' },
          level: { $ref: '#/components/schemas/CefrLevel' },
          lastReviewedAt: {
            anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }]
          }
        },
        required: ['id', 'text', 'meaning', 'phonetic', 'audio', 'example', 'topic', 'partOfSpeech', 'level', 'lastReviewedAt']
      },
      ForgottenQueueResponse: {
        type: 'object',
        properties: {
          words: {
            type: 'array',
            items: { $ref: '#/components/schemas/ForgottenWord' }
          }
        },
        required: ['words']
      },
      ProgressResponse: {
        type: 'object',
        properties: {
          level: {
            anyOf: [{ $ref: '#/components/schemas/CefrLevel' }, { type: 'null' }]
          },
          totalTracked: { type: 'integer' },
          known: { type: 'integer' },
          learning: { type: 'integer' },
          forgotten: { type: 'integer' },
          dueReviewCount: { type: 'integer' }
        },
        required: ['level', 'totalTracked', 'known', 'learning', 'forgotten', 'dueReviewCount']
      },
      ReviewQueueWord: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          text: { type: 'string' },
          meaning: { type: 'string' },
          phonetic: { type: 'string' },
          audio: { type: 'string' },
          example: { type: 'string' },
          topic: { type: 'string' },
          partOfSpeech: { type: 'string' },
          level: { $ref: '#/components/schemas/CefrLevel' },
          nextReviewAt: {
            anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }]
          }
        },
        required: ['id', 'text', 'meaning', 'phonetic', 'audio', 'example', 'topic', 'partOfSpeech', 'level', 'nextReviewAt']
      },
      ReviewQueueResponse: {
        type: 'object',
        properties: {
          words: {
            type: 'array',
            items: { $ref: '#/components/schemas/ReviewQueueWord' }
          }
        },
        required: ['words']
      },
      ReviewDueCountResponse: {
        type: 'object',
        properties: {
          due: { type: 'integer' }
        },
        required: ['due']
      },
      ReadingPassageSummary: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          level: { $ref: '#/components/schemas/CefrLevel' },
          topic: { $ref: '#/components/schemas/Topic' },
          estimatedMinutes: { type: 'integer' },
          vocabularyCount: { type: 'integer' },
          progressPercent: { type: 'number' },
          bookmarked: { type: 'boolean' },
          lastReadAt: { anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] }
        },
        required: [
          'id',
          'title',
          'level',
          'topic',
          'estimatedMinutes',
          'vocabularyCount',
          'progressPercent',
          'bookmarked',
          'lastReadAt'
        ]
      },
      ReadingWord: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          text: { type: 'string' },
          meaning: { type: 'string' },
          phonetic: { type: 'string' },
          audio: { type: 'string' },
          example: { type: 'string' },
          topic: { type: 'string' },
          partOfSpeech: { type: 'string' },
          level: { $ref: '#/components/schemas/CefrLevel' }
        },
        required: ['id', 'text', 'meaning', 'phonetic', 'audio', 'example', 'topic', 'partOfSpeech', 'level']
      },
      ReadingPassageDetail: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'string' },
          level: { $ref: '#/components/schemas/CefrLevel' },
          topic: { $ref: '#/components/schemas/Topic' },
          estimatedMinutes: { type: 'integer' },
          vocabulary: {
            type: 'array',
            items: { $ref: '#/components/schemas/ReadingWord' }
          },
          progressPercent: { type: 'number' },
          bookmarked: { type: 'boolean' },
          lastReadAt: { anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] }
        },
        required: [
          'id',
          'title',
          'content',
          'level',
          'topic',
          'estimatedMinutes',
          'vocabulary',
          'progressPercent',
          'bookmarked',
          'lastReadAt'
        ]
      },
      ReadingPassageListResponse: {
        type: 'object',
        properties: {
          passages: {
            type: 'array',
            items: { $ref: '#/components/schemas/ReadingPassageSummary' }
          }
        },
        required: ['passages']
      },
      ReadingProgressUpdateRequest: {
        type: 'object',
        properties: {
          progressPercent: { type: 'number', minimum: 0, maximum: 100 }
        },
        required: ['progressPercent']
      },
      ReadingProgressUpdateResponse: {
        type: 'object',
        properties: {
          progressPercent: { type: 'number' },
          lastReadAt: { type: 'string', format: 'date-time' }
        },
        required: ['progressPercent', 'lastReadAt']
      },
      ReadingBookmarkRequest: {
        type: 'object',
        properties: {
          bookmarked: { type: 'boolean' }
        },
        required: ['bookmarked']
      },
      ReadingBookmarkResponse: {
        type: 'object',
        properties: {
          bookmarked: { type: 'boolean' }
        },
        required: ['bookmarked']
      },
      ReadingMarkLearnedResponse: {
        type: 'object',
        properties: {
          wordId: { type: 'string' },
          state: { type: 'string', enum: ['Known'] }
        },
        required: ['wordId', 'state']
      },
      MasteryLabel: {
        type: 'string',
        enum: ['Mastered', 'InProgress', 'Struggling', 'NotStarted']
      },
      SearchSort: {
        type: 'string',
        enum: [
          'alphabetical_asc',
          'alphabetical_desc',
          'level_asc',
          'level_desc',
          'learned_desc',
          'learned_asc',
          'frequency_desc',
          'frequency_asc',
          'accuracy_desc',
          'accuracy_asc'
        ]
      },
      SearchWord: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          text: { type: 'string' },
          meaning: { type: 'string' },
          phonetic: { type: 'string' },
          audio: { type: 'string' },
          example: { type: 'string' },
          topic: { type: 'string' },
          partOfSpeech: { type: 'string' },
          level: { $ref: '#/components/schemas/CefrLevel' },
          frequency: { type: 'integer' },
          state: { anyOf: [{ $ref: '#/components/schemas/WordState' }, { type: 'null' }] },
          reviewCount: { type: 'integer' },
          forgottenCount: { type: 'integer' },
          accuracy: { type: 'number' },
          mastery: { $ref: '#/components/schemas/MasteryLabel' },
          lastReviewedAt: { anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
          learnedAt: { anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] }
        },
        required: [
          'id',
          'text',
          'meaning',
          'phonetic',
          'audio',
          'example',
          'topic',
          'partOfSpeech',
          'level',
          'frequency',
          'state',
          'reviewCount',
          'forgottenCount',
          'accuracy',
          'mastery',
          'lastReviewedAt',
          'learnedAt'
        ]
      },
      SearchResponse: {
        type: 'object',
        properties: {
          results: { type: 'array', items: { $ref: '#/components/schemas/SearchWord' } },
          total: { type: 'integer' },
          page: { type: 'integer' },
          count: { type: 'integer' },
          hasMore: { type: 'boolean' }
        },
        required: ['results', 'total', 'page', 'count', 'hasMore']
      },
      SearchFiltersResponse: {
        type: 'object',
        properties: {
          levels: { type: 'array', items: { $ref: '#/components/schemas/CefrLevel' } },
          topics: { type: 'array', items: { $ref: '#/components/schemas/Topic' } },
          partsOfSpeech: { type: 'array', items: { type: 'string' } },
          states: { type: 'array', items: { type: 'string' } },
          mastery: { type: 'array', items: { $ref: '#/components/schemas/MasteryLabel' } },
          sortOptions: { type: 'array', items: { $ref: '#/components/schemas/SearchSort' } }
        },
        required: ['levels', 'topics', 'partsOfSpeech', 'states', 'mastery', 'sortOptions']
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { status: { type: 'string', example: 'ok' } },
                  required: ['status']
                }
              }
            }
          }
        }
      }
    },
    '/v1/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Sign up with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthRequest' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Token issued',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '409': {
            description: 'Email already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Token issued',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/v1/learning/target-level': {
      get: {
        tags: ['Learning'],
        summary: 'Get user target level',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Target level',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TargetLevelResponse' }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Learning'],
        summary: 'Set user target level',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SetTargetLevelRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Target level updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TargetLevelResponse' }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/v1/learning/session/words': {
      get: {
        tags: ['Learning'],
        summary: 'Get learning session words',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'count',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 60, default: 20 }
          },
          {
            name: 'topic',
            in: 'query',
            schema: { $ref: '#/components/schemas/Topic' },
            required: false
          }
        ],
        responses: {
          '200': {
            description: 'Session words',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SessionWordsResponse' }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/v1/learning/words/{wordId}/state': {
      patch: {
        tags: ['Learning'],
        summary: 'Update user word state',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'wordId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateWordStateRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Word state updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateWordStateResponse' }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '404': {
            description: 'Word not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/v1/learning/review/forgotten': {
      get: {
        tags: ['Learning'],
        summary: 'Get forgotten words queue',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'count',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 60, default: 20 }
          }
        ],
        responses: {
          '200': {
            description: 'Forgotten words queue',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ForgottenQueueResponse' }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/v1/learning/review/queue': {
      get: {
        tags: ['Learning'],
        summary: 'Get due review queue',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'count',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 60, default: 20 }
          }
        ],
        responses: {
          '200': {
            description: 'Review queue',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReviewQueueResponse' }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/v1/learning/review/due-count': {
      get: {
        tags: ['Learning'],
        summary: 'Get due review count',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Due review count',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReviewDueCountResponse' }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/v1/learning/progress': {
      get: {
        tags: ['Learning'],
        summary: 'Get progress stats',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Progress stats',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProgressResponse' }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/v1/reading/passages': {
      get: {
        tags: ['Reading'],
        summary: 'Get reading passages',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'count',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 60, default: 20 }
          },
          {
            name: 'level',
            in: 'query',
            schema: { $ref: '#/components/schemas/CefrLevel' },
            required: false
          },
          {
            name: 'topic',
            in: 'query',
            schema: { $ref: '#/components/schemas/Topic' },
            required: false
          },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            required: false
          },
          {
            name: 'bookmarked',
            in: 'query',
            schema: { type: 'boolean' },
            required: false
          }
        ],
        responses: {
          '200': {
            description: 'Reading passages',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReadingPassageListResponse' }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/v1/reading/passages/{passageId}': {
      get: {
        tags: ['Reading'],
        summary: 'Get reading passage detail',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'passageId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Reading passage detail',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReadingPassageDetail' }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '404': {
            description: 'Not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/v1/reading/passages/{passageId}/progress': {
      put: {
        tags: ['Reading'],
        summary: 'Update reading progress',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'passageId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReadingProgressUpdateRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Reading progress updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReadingProgressUpdateResponse' }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/v1/reading/passages/{passageId}/bookmark': {
      post: {
        tags: ['Reading'],
        summary: 'Bookmark reading passage',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'passageId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReadingBookmarkRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Reading bookmark updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReadingBookmarkResponse' }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/v1/reading/words/{wordId}/learned': {
      post: {
        tags: ['Reading'],
        summary: 'Mark a word learned from reading',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'wordId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Word marked learned',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReadingMarkLearnedResponse' }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' }
              }
            }
          }
        }
      }
    },
    '/v1/words/search': {
      get: {
        tags: ['Search'],
        summary: 'Search vocabulary with filters',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string' } },
          { name: 'levels', in: 'query', schema: { type: 'string' } },
          { name: 'topics', in: 'query', schema: { type: 'string' } },
          { name: 'parts', in: 'query', schema: { type: 'string' } },
          { name: 'states', in: 'query', schema: { type: 'string' } },
          { name: 'mastery', in: 'query', schema: { type: 'string' } },
          { name: 'sort', in: 'query', schema: { $ref: '#/components/schemas/SearchSort' } },
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 50, default: 1 } },
          { name: 'count', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 60, default: 20 } }
        ],
        responses: {
          '200': {
            description: 'Search results',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/SearchResponse' } } }
          },
          '400': {
            description: 'Validation error',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } }
          },
          '401': {
            description: 'Unauthorized',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } }
          }
        }
      }
    },
    '/v1/words/filters': {
      get: {
        tags: ['Search'],
        summary: 'Get search filter options',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Search filter options',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/SearchFiltersResponse' } } }
          },
          '401': {
            description: 'Unauthorized',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } }
          }
        }
      }
    }
  }
} as const;

export function getSwaggerUiHtml(specUrl = '/openapi.json'): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>VocabMaster API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.ui = SwaggerUIBundle({
      url: '${specUrl}',
      dom_id: '#swagger-ui'
    });
  </script>
</body>
</html>`;
}
