const InfoPage = () => {
    return (
      <div className="relative min-h-screen text-white overflow-hidden pt-16">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-emerald-400 mb-3">Bath Ticket Reseller</h1>
            <p className="text-gray-300 max-w-md mx-auto">
              Welcome to Bath Ticket Reseller — your reliable marketplace for buying and selling club night tickets in Bath. We strive to provide a safe, easy, and transparent platform for all users.
            </p>
          </div>
  
          {/* Terms & Conditions */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-emerald-400">
              Terms & Conditions
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              By using this site, you agree to trade tickets responsibly. All sales are final, and we do not mediate disputes between buyers and sellers. Please verify ticket details before purchase.
            </p>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to suspend or ban users who violate our policies or engage in fraudulent activity. Always report suspicious listings or behavior to help keep the community safe.
            </p>
          </section>
  
          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-emerald-400">Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              Email: support@bathticketresale.com <br />
              Phone: +1 (555) 123-4567 <br />
              Address: 123 Bath Street, Bath, UK
            </p>
          </section>
        </div>
      </div>
    );
  };
  
  export default InfoPage;
  