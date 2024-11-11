import React from "react";
import { Modal } from 'antd'

const PolicyComponent = ({
  isPolicyVisible,
  handlePolicyAccept,
  setIsPolicyVisible,
}) => {
  return (
    <div>
      <Modal
        title="Policy"
        visible={isPolicyVisible}
        onOk={handlePolicyAccept}
        onCancel={() => setIsPolicyVisible(false)}
      >
        <h2>Content Posting Policy for Affiliate Partners (SHOPS)</h2>
        <h3>1. Purpose</h3>
        <p>
          This policy aims to ensure that content posted on our website
          maintains high quality, adheres to ethical standards, and complies
          with current laws.
        </p>
        <h3>2. Scope</h3>
        <p>
          This policy applies to all affiliate partners (SHOPS) who have
          registered and are permitted to post blogs about their products on our
          website.
        </p>
        <h3>3. Content Regulations</h3>
        <h4>3.1 Permitted Content</h4>
        <ul>
          <li>
            Detailed product information, including features, benefits, and
            usage instructions.
          </li>
          <li>High-quality product images.</li>
          <li>Objective and honest product reviews.</li>
          <li>Information about promotions and discounts (if applicable).</li>
        </ul>
        <h4>3.2 Prohibited Content</h4>
        <ul>
          <li>Incitement of hostility or discrimination in any form.</li>
          <li>Violent, pornographic, or culturally inappropriate content.</li>
          <li>Misleading or false information about products.</li>
          <li>
            Content that infringes on third-party copyrights or intellectual
            property rights.
          </li>
          <li>Advertisements for illegal products or services.</li>
          <li>Spreading of false information or unsubstantiated rumors.</li>
        </ul>
        <h3>4. Moderation Process</h3>
        <ul>
          <li>All posts will be moderated before publication.</li>
          <li>
            We reserve the right to reject or request modifications to any post
            that does not comply with this policy.
          </li>
        </ul>
        <h3>5. Violation Handling</h3>
        <ul>
          <li>
            First violation: Warning and request for content modification.
          </li>
          <li>Second violation: Temporary account suspension for 7 days.</li>
          <li>Third violation: Permanent account termination.</li>
        </ul>
        <h3>6. Legal Terms</h3>
        <p>
          In cases of serious violations, we reserve the right to investigate
          and take action in accordance with applicable laws. Affiliate partners
          bear full legal responsibility for the content they post.
        </p>
        <h3>7. Policy Updates</h3>
        <p>
          We reserve the right to update or modify this policy without prior
          notice. Continued use of our services after changes implies acceptance
          of those changes. Effective Date: [Day/Month/Year]
        </p>
      </Modal>
    </div>
  );
};

export default PolicyComponent;
