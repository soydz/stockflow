"use client"

import { proccessCheckoutAction } from "@/features/order/actions/order.actions";
import { OrderFormData } from "@/features/order/schemas/order.schema";
import { CustomerDetails } from "@/features/payment/components/CustomerDetails";
import { OrderSummary } from "@/features/payment/components/OrderSummary";
import { PaymentForm } from "@/features/payment/components/PaymentForm";
import { CustomerDetailsFormData, customerDetailsSchema } from "@/features/payment/schemas/payment.schema";
import { getProductByIdAction } from "@/features/productos/actions/product.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export interface CheckoutType {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export default function PaymentPage() {
  const [checkout, setCheckout] = useState<CheckoutType>({
    productId: "",
    productName: "",
    price: 0,
    quantity: 0
  });

  const [isCustomerData, setIsCustomerData] = useState<boolean>(false);
  const [customerData, setCustomerData] = useState<CustomerDetailsFormData | null>(null);

  const searchParams = useSearchParams();

  const productId = searchParams.get("productId") || "";
  const quantity = Number(searchParams.get("qty")) || 0;

  const { control, handleSubmit, formState: { errors } } = useForm<CustomerDetailsFormData>({
    resolver: zodResolver(customerDetailsSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      region: "",
      notes: ""
    }
  })


  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId || quantity === 0) return;

      const { product } = await getProductByIdAction(productId);

      if (!product) return;

      setCheckout({
        productId,
        productName: product.data.name,
        price: Number(product.data.price),
        quantity
      });
    }

    fetchProduct();

  }, [productId, quantity])

  // se evitar realizar el cálculo en cada renderizado
  const subtotalAmount = useMemo(() => {
    return checkout.price * checkout.quantity;
  }, [checkout.price, checkout.quantity])

  const shippingAmount = subtotalAmount > 50000 ? 0 : 12000;

  const totalAmount = useMemo(() => {
    return subtotalAmount + shippingAmount;
  }, [subtotalAmount, shippingAmount])

  const customerDetailsOnSubmit = (data: CustomerDetailsFormData) => {
    setIsCustomerData(true);
    setCustomerData(data);
  }

  const onPaymentComplete = async (paymentId: string) => {
    if (!customerData) return;

    // construir el pedido para ser guardado en BD
    const order: OrderFormData = {
      quantity: checkout.quantity,
      status: "PAID",
      totalAmount,
      shippingAmount,
      shippingNotes: customerData.notes,
      paymentDetails: paymentId,
      customerName: customerData.name,
      customerEmail: customerData.email,
      customerPhone: customerData.phone,
      customerAddress: customerData.address,
      customerCity: customerData.city,
      customerRegion: customerData.region,
      unitPrice: checkout.price,
      productName: checkout.productName,
      productId: checkout.productId
    }

    // llama la acción para guardarla en BD
    await proccessCheckoutAction(order);
  }


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        <div className="lg:sticky lg:top-12">
          <CustomerDetails
            control={control}
            errors={errors}
            handleSubmit={() => handleSubmit(customerDetailsOnSubmit)}
            disabled={isCustomerData}
          />
        </div>

        <div className="space-y-8">
          {isCustomerData && (
            <PaymentForm
              onPaymentComplete={onPaymentComplete}
            />
          )}

          <OrderSummary
            checkout={checkout}
            subtotal={subtotalAmount}
            shipping={shippingAmount}
            total={totalAmount}
          />
        </div>

      </div>
    </div>
  );
}