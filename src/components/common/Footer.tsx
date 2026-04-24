
export const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: '人工智能', href: '#' },
      { name: '云计算', href: '#' },
      { name: '大数据', href: '#' },
      { name: '物联网', href: '#' },
      { name: '区块链', href: '#' },
    ],
    solution: [
      { name: '金融科技', href: '#' },
      { name: '智能制造', href: '#' },
      { name: '智慧城市', href: '#' },
      { name: '医疗健康', href: '#' },
      { name: '教育科技', href: '#' },
    ],
    company: [
      { name: '关于我们', href: '/about' },
      { name: '加入我们', href: '#' },
      { name: '新闻动态', href: '#' },
      { name: '联系方式', href: '/contact' },
      { name: '法律声明', href: '#' },
    ],
  }

  return (
    <footer className="border-t border-border bg-background-secondary pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <i className="i-mingcute-cpu-line w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-text">TechCorp</span>
            </div>
            <p className="text-text-secondary text-sm mb-6 leading-relaxed">
              致力于为企业提供领先的科技解决方案，赋能数字化转型，共创智能未来。我们拥有专业的技术团队和丰富的行业经验，帮助客户实现业务创新与增长。
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-fill flex items-center justify-center text-text-secondary hover:bg-accent hover:text-white transition-colors"
              >
                <i className="i-mingcute-wechat-fill w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-fill flex items-center justify-center text-text-secondary hover:bg-accent hover:text-white transition-colors"
              >
                <i className="i-mingcute-weibo-fill w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-fill flex items-center justify-center text-text-secondary hover:bg-accent hover:text-white transition-colors"
              >
                <i className="i-mingcute-github-fill w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-fill flex items-center justify-center text-text-secondary hover:bg-accent hover:text-white transition-colors"
              >
                <i className="i-mingcute-linkedin-fill w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-text mb-4">产品中心</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="font-semibold text-text mb-4">解决方案</h3>
            <ul className="space-y-3">
              {footerLinks.solution.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-text mb-4">关于我们</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-border pt-8 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <i className="i-mingcute-map-pin-line w-5 h-5 text-accent" />
              <span>北京市海淀区中关村科技园区</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <i className="i-mingcute-phone-line w-5 h-5 text-accent" />
              <span>400-888-8888</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <i className="i-mingcute-mail-line w-5 h-5 text-accent" />
              <span>contact@techcorp.com</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-6 text-center">
          <div className="text-xs text-text-tertiary">
            © {currentYear} TechCorp. All rights reserved. 京ICP备XXXXXXXX号
          </div>
        </div>
      </div>
    </footer>
  )
}
