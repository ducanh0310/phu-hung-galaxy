import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white mt-12 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-6">
          <h3 className="font-bold text-2xl md:text-3xl text-white mb-6 tracking-wide">
            Công Ty TNHH Phú Hưng Galaxy Việt Nam
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-slate-200">
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3 text-base">
                <span className="text-blue-400 text-lg">🏢</span>
                <span className="font-semibold text-slate-300">MST:</span>
                <span className="text-white font-medium">0110163751</span>
              </div>
              
              <div className="flex items-start justify-center md:justify-start gap-3 text-base leading-relaxed">
                <span className="text-red-400 text-lg mt-0.5">📍</span>
                <span className="font-semibold text-slate-300 shrink-0">Địa chỉ XHĐ:</span>
                <span className="text-center md:text-left text-slate-100">
                  Số nhà 11, Ngõ 432, Thôn Vân Trai, Phố Quảng Oai, 
                  Thị Trấn Tây Đằng, Huyện Ba Vì, Thành phố Hà Nội, Việt Nam
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3 text-base">
                <span className="text-green-400 text-lg">📞</span>
                <span className="font-semibold text-slate-300">Điện thoại:</span>
                <a 
                  href="tel:0986526526" 
                  className="text-white hover:text-green-300 transition-all duration-300 font-medium"
                >
                  0986526526
                </a>
              </div>
              
              <div className="flex items-center justify-center md:justify-start gap-3 text-base">
                <span className="text-yellow-400 text-lg">✉️</span>
                <span className="font-semibold text-slate-300">Email:</span>
                <a 
                  href="mailto:phuhunggalaxy@gmail.com" 
                  className="text-blue-400 hover:text-blue-300 hover:underline transition-all duration-300 font-medium"
                >
                  phuhunggalaxy@gmail.com
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <h4 className="font-semibold text-slate-300 text-base">Kết nối với chúng tôi</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                  title="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                
                <a 
                  href="https://zalo.me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                  title="Zalo"
                >
                  <span className="text-white font-bold text-sm">Z</span>
                </a>
                
                <a 
                  href="mailto:phuhunggalaxy@gmail.com" 
                  className="bg-red-500 hover:bg-red-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                  title="Gmail"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                  </svg>
                </a>
                
                <a 
                  href="tel:0986526526" 
                  className="bg-green-500 hover:bg-green-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                  title="Gọi điện"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm text-slate-400">
          <p className="font-medium">
            © 2024 Công Ty TNHH Phú Hưng Galaxy Việt Nam. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 