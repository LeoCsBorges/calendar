// import { CheckboxList } from "./Checkboxes";
"use client";
import { useEffect, useState } from "react";
import ProgressIcon from "@/public/progress-check-icon.png"

const weekdays = [
    {key: 1, day: 'Dom'},
    {key: 2, day: 'Seg'},
    {key: 3, day: 'Ter'},
    {key: 4, day: 'Qua'},
    {key: 5, day: 'Qui'},
    {key: 6, day: 'Sex'},
    {key: 7, day: 'Sáb'},
];

// [ CHECKBOX ]
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

const CheckboxList = ({checkedStates, setCheckedStates}) => {
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

    return (
      <>
        <div className="grid grid-cols-7">
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
      </>
    );
};

const CheckboxProgress = ({progressPercentage}) => {
    return (
        <div className="py-1 px-2 bg-slate-200 rounded-lg font-semibold flex items-center justify-center gap-1">
            <img className="w-6 h-auto" src={ProgressIcon.src} alt="Progress icon" />
            <p>Progresso: <span className="text-red-500">{progressPercentage}%</span></p>
        </div>
    );
};


// [CALENDAR ]
const CalendarSideMenu = ({progressPercentage}) => {
    const actualWeekday = new Date().toLocaleDateString('pt-BR', {weekday: "long"});
    const actualDayAndMonth = new Date().toLocaleDateString('pt-BR', {day: "numeric", month: "long"});

    return (
        <div className="w-1/4 p-8 border-r border-gray-300 bg-gray-100 text-left flex flex-col">
            <header>
                <p className="text-red-500 text-sm tracking-widest uppercase mb-5">
                    hoje
                </p>
                <h2 className="text-3xl font-bold">
                    <span className="capitalize">{actualWeekday}</span>,<br/>{actualDayAndMonth}
                </h2>
            </header>
            <div className="grow">
                <div className="h-full flex flex-col justify-end">
                    <CheckboxProgress progressPercentage={progressPercentage} />
                </div>
            </div>
        </div>
    );
};

const CalendarContent = ({checkedStates, setCheckedStates}) => {
    const actualMonth = new Date().toLocaleDateString('pt-BR', {month: "long"});
    const actualYear = new Date().getFullYear();
    
    function CalendarWeekdaysTitles() {
        return (
            <div className="grid grid-cols-7">
                {weekdays.map((item) => (
                    <div key={item.key} className="justify-self-end px-2">
                        <p className="text-slate-500">{item.day}</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="grow p-8">
            <header className="py-6 text-left">
                <h2 className="text-4xl">
                    <span className="font-extrabold capitalize">{actualMonth}</span> {actualYear}
                </h2>
            </header>
            <section className="">
                <CalendarWeekdaysTitles /> 
                <CheckboxList checkedStates={checkedStates} setCheckedStates={setCheckedStates} /> {/* dias do mes  */}
            </section>
        </div>
    );
};

export default function Calendar() {
    const [checkedStates, setCheckedStates] = useState(Array(31).fill({checked: false, date: null}));
    const [progressPercentage, setProgressPercentage] = useState(0);
    const percentagePerDay = (100 / checkedStates.length);

    //atualizar o progress %
    useEffect(() => {
        const totalChecked = checkedStates.filter((item) => item.checked === true).length;
        setProgressPercentage((totalChecked * percentagePerDay).toFixed(1));
    }, [checkedStates]);

    return (
        <div className="flex rounded-4xl border border-gray-100 shadow-md overflow-hidden">
            <CalendarSideMenu progressPercentage={progressPercentage} />
            <CalendarContent checkedStates={checkedStates} setCheckedStates={setCheckedStates} />
        </div>
    );
};