import { Minus, Plus } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";

interface QuantityStepperProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max: number;
    disable?: boolean;
}

export function QuantityStepper({ value, onChange, min = 1, max, disable }: Readonly<QuantityStepperProps>) {

    const handleIncrement = () => {
        if (value < max) onChange(value + 1);
    }

    const handleDecrement = () => {
        if (value > min) onChange(value - 1);
    }

    return (
        <div className="flex items-center justify-center gap-2 w-fit">
            <Button
                variant="outline"
                size="icon"
                onClick={() => handleDecrement()}
                disabled={disable || value <= min}
            >
                <Minus size={16} />
            </Button>

            <Input
                type="text"
                value={value}
                className="w-12 text-center p-0"
                readOnly
            />

            <Button
                variant="outline"
                size="icon"
                onClick={() => handleIncrement()}
                disabled={disable || value >= max}
            >
                <Plus size={16} />
            </Button>
        </div>
    )
}