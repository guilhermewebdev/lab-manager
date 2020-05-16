import * as React from 'react';

import NumberFormat from 'react-number-format';

interface NumberFormatCustomProps {
    inputRef: (instance: NumberFormat | null) => void;
    onChange: (event: { target: { name: string; value: number } }) => void;
    name: string;
}

export default function CurrencyFormat(props: NumberFormatCustomProps) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.floatValue || 0,
                    },
                });
            }}
            thousandSeparator="."
            decimalSeparator=","
            isNumericString
            allowEmptyFormatting
            defaultValue={0}
            allowNegative={false}
            fixedDecimalScale
            decimalScale={2}
        />
    );
}