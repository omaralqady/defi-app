import { useEthers } from "@usedapp/core";
import { YourWallet } from "./your_wallet";
import helperConfig from "../helper-config.json";
import networkMapping from "../chain-info/deployments/map.json";
import { constants } from "ethers";
import brownieConfig from "../brownie-config.json";
import fps from "../img/fps.png";
import dai from "../img/dai.png";
import eth from "../img/eth.png";
import { makeStyles } from "@material-ui/core";

export type Token = {
    image: string
    address: string
    name: string
};

const useStyles = makeStyles((theme) => ({
   title: {
       color: theme.palette.common.white,
       textAlign: "center",
       padding: theme.spacing(4)
   } 
}));

export const Main = () => {
    const classes = useStyles();
    const { chainId } = useEthers();
    const network = chainId ? helperConfig[String(chainId)] : "dev";
    const tokenAddress = chainId 
        ? networkMapping[String(chainId)]["FPSToken"][0]
        : constants.AddressZero;

    const wethToken = chainId
        ? brownieConfig["networks"][network]["weth_token"]
        : constants.AddressZero;

    const fauToken = chainId
        ? brownieConfig["networks"][network]["fau_token"]
        : constants.AddressZero;

    const supportedTokens : Array<Token> = [
        {image: fps, address: tokenAddress, name: "FPS"},
        {image: eth, address: wethToken, name: "WETH"},
        {image: dai, address: fauToken, name: "FAU"}
    ];

    return (<div>
    <h2 className={classes.title}>FPS Token App</h2>
    <YourWallet supportedTokens={supportedTokens} />
    </div>
    )
};