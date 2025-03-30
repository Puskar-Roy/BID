import { prepareContractCall, type SmartContract } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";

interface PurchaseProductParams {
  _productId: number;
  _name: string;
  _description: string;
  _authorId: number;
  _authorAddress: string;
  _price: number;
  contract: SmartContract;
}

export default function Component({ 
  _productId, 
  _name, 
  _description, 
  _authorId, 
  _authorAddress, 
  _price,
  contract 
}: Partial<PurchaseProductParams>) {
  const { mutate: sendTransaction } = useSendTransaction();

  const onClick = (): void => {
    if (!contract || _productId === undefined || !_name || !_description || 
        _authorId === undefined || !_authorAddress || _price === undefined) {
      console.error("Missing required parameters for purchase");
      return;
    }

    const transaction = prepareContractCall({
      contract,
      method:
        "function purchaseProduct(uint256 _productId, string _name, string _description, uint256 _authorId, address _authorAddress, uint256 _price) payable",
      params: [
        _productId,
        _name,
        _description,
        _authorId,
        _authorAddress,
        _price,
      ],
    });
    sendTransaction(transaction);
  };

  return (
    <button onClick={onClick}>
      Purchase Product
    </button>
  );
}
