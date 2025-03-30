import { useReadContract, type SmartContract } from "thirdweb/react";

interface PurchaseDetails {
  name: string;
  description: string;
  productId: number;
  authorAddress: string;
  price: number;
  transactionTime: number;
  owner: string;
}

interface GetPurchaseDetailsProps {
  contract: SmartContract;
  _productId: number;
}

export default function Component({
  contract,
  _productId,
}: GetPurchaseDetailsProps) {
  const { data, isPending, error } = useReadContract<PurchaseDetails>({
    contract,
    method:
      "function getPurchaseDetails(uint256 _productId) view returns ((string name, string description, uint256 productId, address authorAddress, uint256 price, uint256 transactionTime, address owner))",
    params: [_productId],
  });

  return (
    <div>
      {isPending && <p>Loading purchase details...</p>}
      {error && <p>Error loading purchase details: {error.message}</p>}
      {data && (
        <div>
          <h2>{data.name}</h2>
          <p>{data.description}</p>
          <p>Product ID: {data.productId.toString()}</p>
          <p>Author: {data.authorAddress}</p>
          <p>Price: {data.price.toString()}</p>
          <p>
            Transaction Time:{" "}
            {new Date(data.transactionTime * 1000).toLocaleString()}
          </p>
          <p>Owner: {data.owner}</p>
        </div>
      )}
    </div>
  );
}
