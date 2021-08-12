import { Container, Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { TokenInfoEntity } from 'orm'
import { Token } from 'graphql/schema'

@Service()
export class TokenService {
  constructor(
    @InjectRepository(TokenInfoEntity) private readonly repo: Repository<TokenInfoEntity>
  ) {}

  async getToken(token: string, repo = this.repo): Promise<Token> {
    const tokenInfo = await repo.findOne({ where: { tokenAddress: token } })
    return {
      tokenAddress: token,
      symbol: tokenInfo?.symbol,
      includedPairs: tokenInfo?.pairs,
    }
  }

  async getTokens(tokens?: string[], repo = this.repo): Promise<Token[]> {
    if (!tokens){
      tokens = []
      const tokenInfos = await repo.find()
      for (const tokenInfo of tokenInfos) {
        tokens.push(tokenInfo.tokenAddress)
      }
    }
    const result = []
    for (const token of tokens){
      result.push(await this.getToken(token))
    }
    return result
  }
}

export function tokenService(): TokenService {
  return Container.get(TokenService)
}
