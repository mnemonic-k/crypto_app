import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class UniswapService {
  provider: ethers.JsonRpcProvider;

  constructor(private readonly configService: ConfigService) {
    const BSC_RPC = this.configService.get<string>('BSC_RPC_PROVIDER');

    this.provider = new ethers.JsonRpcProvider(BSC_RPC);
  }

  async getTokenDecimals(tokenAddress: string): Promise<number> {
    const tokenABI = [
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ];

    const tokenContract: ethers.Contract = new ethers.Contract(
      tokenAddress,
      tokenABI,
      this.provider,
    );

    const decimals = await tokenContract.decimals();

    return Number(decimals);
  }

  getFactoryContract(factoryAddress: string): ethers.Contract {
    const factoryABI = [
      'function getPair(address tokenA, address tokenB) external view returns (address pair)',
    ];

    const factoryContract = new ethers.Contract(
      factoryAddress,
      factoryABI,
      this.provider,
    );

    return factoryContract;
  }

  getPairContract(pairAddress: string): ethers.Contract {
    const pairABI = [
      'function getReserves() external view returns (uint112, uint112, uint32)',
      'function token0() external view returns (address)',
      'function token1() external view returns (address)',
    ];

    const pairContract = new ethers.Contract(
      pairAddress,
      pairABI,
      this.provider,
    );

    return pairContract;
  }

  async getTokensReserves(pairAddress: string): Promise<any> {
    const pairContract = this.getPairContract(pairAddress);

    const [reserve0, reserve1] = await pairContract.getReserves();

    const addressTokenA = await pairContract.token0();
    const addressTokenB = await pairContract.token1();

    return [
      { tokenAdrress: addressTokenA, reserves: reserve0 },
      { tokenAdrress: addressTokenB, reserves: reserve1 },
    ];
  }

  async getUniswapRate(
    addressTokenA: string,
    addressTokenB: string,
    factoryAddress: string,
  ): Promise<any> {
    const factoryContract = this.getFactoryContract(factoryAddress);

    const pairAddress = await factoryContract.getPair(
      addressTokenA,
      addressTokenB,
    );

    const [token0, token1] = await this.getTokensReserves(pairAddress);

    let price;
    const scaleFactor = BigInt(10 ** 9);

    if (token0.tokenAdrress === addressTokenA) {
      price = (token1.reserves * scaleFactor) / token0.reserves;
    } else if (token0.tokenAdrress === addressTokenB) {
      price = (token0.reserves * scaleFactor) / token1.reserves;
    }

    return { pairAddress, price: Number(price) / Number(scaleFactor) };
  }
}
