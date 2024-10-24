export default {
  binary:
    '80c6334ada743465b064012b076265657371636b0101000000000103116c39b067e231fa762f850581e45747e74f028ac9889f521d9b1d24201ee95201000101000000000103aad64a4d4c1823f6607e06f5d2ab9d183e1c10032fcb96901067626ee24c6754010001010000000001027d8bc31c4b8c43eb8e6859615c65f1b148dadf09114b3eba8dde2d2cced656bb010001025b06f7b909dab2e9015e8b4c0160aee807978b0d572082b008569bebf80ce96200000000012058e5bbbdfea5e8a250c80b8aa12bc85cf240ab52e448fba197c0e1c95d6d07a623f090eab7af5f4bd4999490f3f5ac99f6352a60e8b7c3a4300eb3b9877850e2',
  offsets: [
    { key: 'ref_block_num', type: 'scalar', offset: 0, size: 2, value: '50816' },
    { key: 'ref_block_prefix', type: 'scalar', offset: 2, size: 4, value: '1960462899' },
    { key: 'expiration', type: 'scalar', offset: 6, size: 4, value: '2023-07-13T20:57:24' },
    {
      key: 'operations',
      type: 'array',
      offset: 10,
      size: 173,
      value: 'Length: 1',
      length: 1,
      children: [
        {
          key: '0',
          type: 'object',
          offset: 11,
          size: 172,
          children: [
            {
              key: 'type',
              type: 'scalar',
              offset: 11,
              size: 1,
              value: 'account_update2_operation'
            },
            {
              key: 'value',
              type: 'object',
              offset: 12,
              size: 171,
              children: [
                { key: 'account', type: 'scalar', offset: 12, size: 8, value: 'beesqck' },
                {
                  key: 'owner',
                  type: 'object',
                  offset: 20,
                  size: 42,
                  children: [
                    {
                      key: 'weight_threshold',
                      type: 'scalar',
                      offset: 21,
                      size: 4,
                      value: '1'
                    },
                    { key: 'account_auths', type: 'object', offset: 25, size: 1, children: [] },
                    {
                      key: 'key_auths',
                      type: 'object',
                      offset: 26,
                      size: 36,
                      children: [
                        {
                          key: 'STM6xua4w518fPWyp7hTGY5GhKNT5oD3jaHnwYpacBQEqvzawGUB2',
                          type: 'scalar',
                          offset: 27,
                          size: 35,
                          value: '1'
                        }
                      ]
                    }
                  ]
                },
                {
                  key: 'active',
                  type: 'object',
                  offset: 62,
                  size: 42,
                  children: [
                    {
                      key: 'weight_threshold',
                      type: 'scalar',
                      offset: 63,
                      size: 4,
                      value: '1'
                    },
                    { key: 'account_auths', type: 'object', offset: 67, size: 1, children: [] },
                    {
                      key: 'key_auths',
                      type: 'object',
                      offset: 68,
                      size: 36,
                      children: [
                        {
                          key: 'STM88ULJzA71eVYYEZiDGoLy1sVWTiUn6iK1jp2ApBAiUYvwTobRE',
                          type: 'scalar',
                          offset: 69,
                          size: 35,
                          value: '1'
                        }
                      ]
                    }
                  ]
                },
                {
                  key: 'posting',
                  type: 'object',
                  offset: 104,
                  size: 42,
                  children: [
                    {
                      key: 'weight_threshold',
                      type: 'scalar',
                      offset: 105,
                      size: 4,
                      value: '1'
                    },
                    {
                      key: 'account_auths',
                      type: 'object',
                      offset: 109,
                      size: 1,
                      children: []
                    },
                    {
                      key: 'key_auths',
                      type: 'object',
                      offset: 110,
                      size: 36,
                      children: [
                        {
                          key: 'STM5qnFpYEhBnvre8PMXDeturPggwY9EBPvcNXnKBVx5zHUyS35xX',
                          type: 'scalar',
                          offset: 111,
                          size: 35,
                          value: '1'
                        }
                      ]
                    }
                  ]
                },
                {
                  key: 'memo_key',
                  type: 'scalar',
                  offset: 146,
                  size: 34,
                  value: 'STM5aaXDP4cCLiUVedfkN4scTqfYFmwHuqEYAhmtWvo5Dzw63cbwZ'
                },
                { key: 'json_metadata', type: 'scalar', offset: 180, size: 1 },
                { key: 'posting_json_metadata', type: 'scalar', offset: 181, size: 1 },
                {
                  key: 'extensions',
                  type: 'array',
                  offset: 182,
                  size: 1,
                  value: 'Length: 0',
                  length: 0,
                  children: []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      key: 'extensions',
      type: 'array',
      offset: 183,
      size: 1,
      value: 'Length: 0',
      length: 0,
      children: []
    },
    {
      key: 'signatures',
      type: 'array',
      offset: 184,
      size: 66,
      value: 'Length: 1',
      length: 1,
      children: [
        {
          key: '0',
          type: 'scalar',
          offset: 185,
          size: 65,
          value:
            '2058e5bbbdfea5e8a250c80b8aa12bc85cf240ab52e448fba197c0e1c95d6d07a623f090eab7af5f4bd4999490f3f5ac99f6352a60e8b7c3a4300eb3b9877850e2'
        }
      ]
    }
  ]
};
