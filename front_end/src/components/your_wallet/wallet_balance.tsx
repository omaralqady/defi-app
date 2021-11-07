import { Token } from '../main';
import { useEthers, useTokenBalance } from '@usedapp/core';
import { formatUnits } from "@ethersproject/units";
import { BalanceMessage } from "../../components/balance_message";

export interface WalletBalanceProps {
        token: Token;
}

export const WalletBalance = ({token}: WalletBalanceProps) => {
        const { image, address, name } = token;
        const { account } = useEthers();
        const tokenBalance = useTokenBalance(address, account);
        const formattedBalance : number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0;

        return (<BalanceMessage
            amount={formattedBalance} 
            label={`Your unstaked ${name} balance`}
            tokenImgSrc={image}
            />);
}