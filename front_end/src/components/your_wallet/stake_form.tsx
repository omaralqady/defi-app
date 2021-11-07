import { Token } from "../main";
import { useEthers, useTokenBalance, useNotifications, Notification } from "@usedapp/core";
import { formatUnits } from "@ethersproject/units";
import { Button, Input, CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import React, { useState, useEffect } from "react";
import { useStakeTokens } from "../../hooks";
import { utils } from "ethers";

interface StakeFormProps {
    token: Token
}

export const StakeForm = ({ token } : StakeFormProps) => {
    const { address: tokenAddress, name } = token;
    const { account } = useEthers();
    const tokenBalance = useTokenBalance(tokenAddress, account);
    const formattedBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0;
    const { notifications } = useNotifications();

    const [ amount, setAmount ] = useState<number | string | Array<number | string>>(0);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value);
        setAmount(newAmount);
        console.log("new amount: ", newAmount);
    };

    const { approveAndStake, state: approveAndStakeTokenState } = useStakeTokens(tokenAddress);
    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString());
        return approveAndStake(amountAsWei.toString());
    };

    const isMining = approveAndStakeTokenState.status === "Mining";
    const [showTokenApprovalSuccess, setShowTokenApprovalSuccess] = useState(false);
    const [showStakeTokenSuccess, setStakeTokenSuccess] = useState(false);

    const handleCloseSnackbar = () => {
        setShowTokenApprovalSuccess(false);
        setStakeTokenSuccess(false);
    };

    useEffect(() => {
        const approvals = filterTx(notifications, "transactionSucceed", "Approve Token Transfer");

        if (approvals.length > 0) {
            setShowTokenApprovalSuccess(true);
            setStakeTokenSuccess(false);
        }

        const stakedList = filterTx(notifications, "transactionSucceed", "Stake Tokens");

        if (stakedList.length > 0) {
            setShowTokenApprovalSuccess(false);
            setStakeTokenSuccess(true);
        }

    }, [notifications]);

    return (<div>
                <div>
                    <Input onChange={handleInputChange}/>
                    <Button onClick={handleStakeSubmit} color="primary" size="large" disabled={isMining}>
                        {isMining ? <CircularProgress size ={26} /> : "Stake"}
                    </Button>
                </div>
                <Snackbar open={showTokenApprovalSuccess} onClose={handleCloseSnackbar} autoHideDuration={5000}>
                    <Alert onClose={handleCloseSnackbar} severity="success">
                        Token transfer approved! Now approve the second transaction.
                    </Alert>
                </Snackbar>
                <Snackbar open={showStakeTokenSuccess} onClose={handleCloseSnackbar} autoHideDuration={5000}>
                <Alert onClose={handleCloseSnackbar} severity="success">
                    Tokens staked!
                </Alert>
            </Snackbar>
        </div>
    );
};

const filterTx = (list : any, type: string, tx: string) => {
    return list.filter((item: any) => {
        if (item.type === type && item.transactionName === tx) {
            return true;
        } else {
            return false;
        }
    })
}