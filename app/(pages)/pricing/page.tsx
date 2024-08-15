export default function Pricing() {
  const plans = [
    {
      name: "Basic",
      price: "$999",
      features: ["5 pages", "Basic SEO", "1 month support"],
    },
    {
      name: "Pro",
      price: "$1,999",
      features: [
        "10 pages",
        "Advanced SEO",
        "3 months support",
        "E-commerce integration",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Unlimited pages",
        "Full SEO suite",
        "1 year support",
        "Custom features",
      ],
    },
  ];

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-12">Pricing Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md text-center"
          >
            <h2 className="text-2xl font-semibold mb-4">{plan.name}</h2>
            <p className="text-3xl font-bold mb-6">{plan.price}</p>
            <ul className="mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="mb-2">
                  {feature}
                </li>
              ))}
            </ul>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
