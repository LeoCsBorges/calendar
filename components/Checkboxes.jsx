'use client'
import { useEffect, useState } from "react";

function isAnotherDay(storedDateISOString) {
  const storedDate = new Date(storedDateISOString);
  const today = new Date();

  // [ diferenca em minutos, para fins de testes ] ***
  const storedLocal = storedDate.toLocaleDateString('pt-BR', {minute: "numeric"});
  const todayLocal = today.toLocaleDateString('pt-BR', {minute: "numeric"});

  return storedLocal !== todayLocal;
}

const Checkbox = ({ index, checked, onChange, disabled }) => {
    return (
      <label
        className={`
          w-full aspect-square p-4 border border-slate-400 transition-all duration-300 ease-in-out text-right text-sm md:text-lg lg:text-2xl font-semibold select-none cursor-pointer
          ${
            checked
              ? 'bg-emerald-100 text-slate-500'
              : 'bg-slate-100 text-slate-400'
          }
          ${
            disabled 
                ? 'opacity-40 pointer-events-none' 
                : 'opacity-100 cursor-pointer'}
        `}
      >
        <p>{index + 1}</p>
        <input
          type="checkbox"
          className="peer hidden"
          checked={checked}
          onChange={() => onChange(index)}
          disabled={disabled}
        />
      </label>
    );
};

const CheckboxList = () => {
    const [checkedStates, setCheckedStates] = useState(Array(31).fill({checked: false, date: null}));
    const [progressPercentage, setProgressPercentage] = useState(0);
    const percentagePerDay = (100 / checkedStates.length);

    // Ao clicar no checkbox
    const handleCheckboxChange = (index) => {
      const currentItem = checkedStates[index];

      //validação de segurança
      if (index < 0 || index >= checkedStates.length) return;  
    
      // Já está marcado? Não permitir desmarcar
      if (currentItem.checked) return;
    
      // Se não é o primeiro checkbox
      if (index > 0) {
        const previousItem = checkedStates[index - 1];
    
        // Se o anterior não está marcado, não permite
        if (!previousItem.checked) return;
    
        // Se ainda for o mesmo dia do checkbox anterior, não permite
        if (!isAnotherDay(previousItem.date)) return;
      }
    
      // Passou pelas regras de negócio, atualizar o checkedStates
      const updatedStates = [...checkedStates];
      updatedStates[index] = {
        checked: true,
        date: new Date().toISOString(),
      };
      setCheckedStates(updatedStates);
    };

    // atualizar o % progress
    useEffect(() => {
      const totalChecked = checkedStates.filter((item) => item.checked === true).length;
      setProgressPercentage((totalChecked * percentagePerDay).toFixed(1));
    }, [checkedStates]);

    return (
        <>
            <div className="grid grid-cols-7 p-4">
                {checkedStates.map((item, index) => (
                    <Checkbox
                        key={index}
                        index={index}
                        checked={item.checked}
                        disabled={index > 0 && !checkedStates[index - 1].checked}
                        onChange={handleCheckboxChange}
                    />
                ))}
            </div>
            <div className="mt-10">
                <p className="w-max mx-auto p-2 text-md border border-slate-200 rounded-lg"> Seu progresso está em: <span className="text-blue-600 font-semibold">{progressPercentage}%</span></p>
            </div>
        </>
    );
};

export default CheckboxList;