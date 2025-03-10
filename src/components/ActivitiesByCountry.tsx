import SingleActivity from "./SingleActivity";

const ActivitiesByCountry = () => {
  return (
    <div>
      <h4 className="text-2xl text-whiteSecondary font-bold mb-7 max-[440px]:text-left">
        Activity by country
      </h4>
      <div className="w-full flex flex-col gap-y-4 max-[440px]:grid max-[440px]:grid-cols-2 max-[390px]:grid-cols-1">
        <SingleActivity
          mainTitle="United States"
          totalVisitors="5,200"
          totalMoney="$2300,20"
          percent="+20%"
        >
          <img src="/src/assets/united-states.png" alt="United States" />
        </SingleActivity>
        <SingleActivity
          mainTitle="United Kingdom"
          totalVisitors="3,100"
          totalMoney="$1000,00"
          percent="+15%"
        >
          <img src="/src/assets/united-kingdom.png" alt="United Kingdom" />
        </SingleActivity>
        <SingleActivity
          mainTitle="China"
          totalVisitors="13,800"
          totalMoney="$8000,40"
          percent="+50%"
        >
          <img src="/src/assets/china.png" alt="China" />
        </SingleActivity>
        <SingleActivity
          mainTitle="Canada"
          totalVisitors="3,700"
          totalMoney="$9000,34"
          percent="+45%"
        >
          <img src="/src/assets/canada.png" alt="Canada" />
        </SingleActivity>
        <SingleActivity
          mainTitle="Germany"
          totalVisitors="8,100"
          totalMoney="$4000,00"
          percent="-5%"
        >
          <img src="/src/assets/germany.png" alt="Germany" />
        </SingleActivity>
        <SingleActivity
          mainTitle="France"
          totalVisitors="900"
          totalMoney="$500,00"
          percent="-25%"
        >
          <img src="/src/assets/france.png" alt="France" />
        </SingleActivity>
      </div>
    </div>
  );
};

export default ActivitiesByCountry;
